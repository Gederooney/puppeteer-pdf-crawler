import * as stream from "stream";
import { promisify } from "util";
import { Logger } from "tslog";
const axios = require("axios");
const fs = require("fs");

const log = new Logger({ name: "Puppetter utils" });
const finished = promisify(stream.finished);

export class PuppeteerUtils {
	static async downloadPdf(options: unknown, filename: string) {
		const writer = fs.createWriteStream(`cvs/${filename}`);
		log.info(`Start downloading file ${filename}`);
		return axios(options)
			.then(async (res: any) => {
				//log.info(`piping to file file ${filename}`);
				res.data.pipe(writer);
				return finished(writer);
			})
			.catch((err: Error) => {
				log.debug("Axios failed to download");
				throw new Error("Axios failed to download");
			});
	}
}
