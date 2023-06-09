//for typescript className definition
import { Logger } from "tslog";
import {
	LaunchOptions,
	BrowserLaunchArgumentOptions,
	BrowserConnectOptions,
} from "puppeteer";
import { Crawler } from "./crawler";

const puppeteer = require("puppeteer");
const log = new Logger({ name: "Crawler" });

const config: LaunchOptions &
	BrowserLaunchArgumentOptions &
	BrowserConnectOptions = {
	headless: true,
	//npmexecutablePath : "/usr/bin/chromium",
	args: ["--no-sandbox"],
};
(async () => {
	log.info("Lunching Browser");
	const browser = await puppeteer.launch(config);

	let crawler = new Crawler(browser);
	await crawler.run();
	log.info("Closing Browser");
	await browser.close();
})();
