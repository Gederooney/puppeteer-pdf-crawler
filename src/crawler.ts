import { Browser, Page } from "puppeteer";
import { processBatch, sleep } from "./process";

const fs = require("fs");
const FileType = require("file-type");

const config = require("config");
const path = require("path");

import { Logger } from "tslog";
import { PuppeteerUtils } from "./PuppeteerUtils";
const log = new Logger({ name: "gedeon crowler" });

export class Crawler {
	private browser: Browser;
	private cookies: any;

	constructor(browser: Browser) {
		this.browser = browser;
	}

	async connectToAccount(page: Page): Promise<void> {
		const url: string = config.get("manitou").url;
		const email: string = config.get("manitou").email;
		const mdp: string = config.get("manitou").motdepasse;

		try {
			log.info(`...Connecting to manitou`);
			await page.goto(url, {
				waitUntil: "load",
				timeout: 0,
			});
			await page.waitForSelector("#courriel");
			await page.type("#courriel", email);
			await page.type("#motdepasse", mdp);
			await page.click(".bt-connexion");
			await page.waitForNavigation();
			//do some stuff;
			//we just return nothing;
		} catch (error) {
			log.error("Failed to connect");
			throw new Error("Failed to connect");
		}
		log.info(`>>Connected<<`);
	}
	async fetchProfile(profileData: any) {
		const filename = profileData.id;
		const url = "https://manitousolution.com/manitou18/" + profileData.cv;
		const options = {
			responseType: "stream",
			encoding: null,
			method: "GET",
			url: url,
			headers: {
				Accept: "application/json, text/plain, */*",
				"sec-ch-ua": '"Chromium";v="93", " Not;A Brand";v="99"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"macOS"',
				"user-agent":
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.0 Safari/537.36",
				Cookie: "",
			},
		};
		// @ts-ignore
		options.headers.Cookie = this.cookies;
		try {
			await PuppeteerUtils.downloadPdf(options, filename);
			const ext = await FileType.fromFile(`cvs/${filename}`);
			fs.rename(
				`cvs/${filename}`,
				`cvs/${filename}.${ext.ext}`,
				(error: Error) => {
					if (error) log.debug(error.message);
					else log.info("file renamed");
				}
			);
		} catch (error) {
			log.debug("Failed to rename or download");
			throw new Error("Failed to manage profile file");
		}
	}
	async searchAllProfile(): Promise<unknown[]> {
		let userList = [];
		const page = await this.browser.newPage();
		try {
			//connexion
			await this.connectToAccount(page);
			log.info(`>Navigating to crawling page`);
			await page.click(".ui-button");
			await page.click('li[data-id="11"]');
			await page.waitForSelector("ul.t-Cards > li");
			await page.click("ul.t-Cards > li");
			await page.waitForSelector("#rpt-candidat_row_select");
			await page.select("#rpt-candidat_row_select", "5000");
			await page.waitForTimeout(30 * 1000);
			await page.waitForSelector("table.a-IRR-table > tbody");
			this.cookies = await page.cookies();
			this.cookies = this.cookies
				// @ts-ignore
				.map((ck) => ck.name + "=" + ck.value)
				.join(";");
			log.info(`>Crawling info`);
			// @ts-ignore
			userList = await page.evaluate(() => {
				// @ts-ignore
				const res = [];
				// @ts-ignore
				let trs = Array.from(
					// @ts-ignore
					document.querySelector("table.a-IRR-table > tbody").children
				);
				trs.shift();
				trs.map(async (tr, index) => {
					// @ts-ignore
					let tds = Array.from(tr.children);
					// @ts-ignore
					let id = index;
					// @ts-ignore
					let dateOfCreation = tds[2].textContent;
					// @ts-ignore
					let name = tds[3].textContent;
					// @ts-ignore
					let status = tds[4].textContent;
					// @ts-ignore
					let numeroIntern = tds[5].textContent;
					// @ts-ignore
					let domaineEmploi = tds[6].textContent;
					// @ts-ignore
					let classeEmploi = tds[7].textContent;
					// @ts-ignore
					let courriel = tds[8].textContent;
					// @ts-ignore
					let phone = tds[9].textContent;
					// @ts-ignore
					let commentaire = tds[12].textContent;
					// @ts-ignore
					let cv = tds[10].querySelector("label > a").getAttribute("href")
						? // @ts-ignore
						  tds[10].querySelector("label > a").getAttribute("href")
						: "";
					res.push({
						id,
						dateOfCreation,
						name,
						status,
						numeroIntern,
						domaineEmploi,
						classeEmploi,
						courriel,
						phone,
						commentaire,
						cv,
					});
				});
				// @ts-ignore
				return res;
			});
		} catch (e) {
			log.error("Failed to fetch profiles");
			log.error(e);
		} finally {
			//close the page here
			await page.close();
		}
		return userList;
	}

	makeJson = (usersList: unknown[]) => {
		log.info("Saving users in users.json file");
		fs.writeFile(
			"users.json",
			JSON.stringify({ users: usersList }),
			"utf8",
			(err: Error) => {
				if (err) return log.error(err.message);
			}
		);
	};

	async run() {
		const profileLinks = await this.searchAllProfile();
		this.makeJson(profileLinks);
		log.info(`Found ${profileLinks.length}  profiles`);
		// await this.fetchProfile(profileLinks[0]);
		await processBatch(
			profileLinks,
			async (item) => await this.fetchProfile(item),
			async () => {
				await sleep(5000);
				return true;
			},
			1
		);
	}
}
