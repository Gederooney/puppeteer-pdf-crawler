# Puppeteer PDF Crawler

This project is a tool for crawling and downloading PDF files using Puppeteer.

## Overview

The Puppeteer PDF Crawler is designed to connect to specific accounts, search for profiles, and fetch relevant data. It is built using TypeScript and utilizes the Puppeteer library.

## Configuration

Configuration options are available in the `config` directory. `default.json` file contains the information required to connect to specific accounts. It includes fields for email, password, and URL for each account&#8203;``oaicite:{"number":1,"metadata":{"title":"puppeteer-pdf-crawler/default.json at master · Gederooney/puppeteer-pdf-crawler · GitHub","url":"https://github.com/Gederooney/puppeteer-pdf-crawler/blob/master/config/default.json","text":"manitou\": {  \n  \"email\": \"***\",  \n  \"motdepasse\": \"***\",  \n  \"url\": \"https://manitousolution.com/application/fr/connexion\"  \n  },  \n  \"gestate\": {  \n  \"client\": \"***\",  \n  \"email\": \"***\",  \n  \"motdepasse\": \"***\",  \n  \"url\": \"https://app.lgestat.com/fr/auth/login","pub_date":null}}``&#8203;.

## Code Structure

The main entry point of the application is the `index.ts` file in the `src` directory. It initializes a new instance of the `GedeonCrawler` class and launches the browser using Puppeteer&#8203;``oaicite:{"number":2,"metadata":{"title":"puppeteer-pdf-crawler/index.ts at master · Gederooney/puppeteer-pdf-crawler · GitHub","url":"https://github.com/Gederooney/puppeteer-pdf-crawler/blob/master/src/index.ts","text":"for typescript className definition  \n import { Logger } from \"tslog\";  \n import {  \n  LaunchOptions,  \n  BrowserLaunchArgumentOptions,  \n  BrowserConnectOptions,  \n } from \"puppeteer\";  \n import { GedeonCrawler } from \"./gedeonCrawler\";  \n\n const puppeteer = require(\"puppeteer\");  \n const log = new Logger({ name: \"Gedeon Crawler\" });  \n\n const config: LaunchOptions &  \n  BrowserLaunchArgumentOptions &  \n  BrowserConnectOptions = {  \n  headless: true,  \n  //npmexecutablePath : \"/usr/bin/chromium\",  \n  args: [\"--no-sandbox\"],  \n };  \n (async () => {  \n  log.info(\"Lunching Browser\");  \n  const browser = await puppeteer.launch(config);  \n\n  let crawler = new GedeonCrawler(browser);  \n  await crawler.run();  \n  log.info(\"Closing Browser\");  \n  await browser.close","pub_date":null}}``&#8203;.

The `GedeonCrawler.ts` file defines the `GedeonCrawler` class, which contains the core functionality of the crawler. It can connect to an account, search for profiles, and fetch profile data&#8203;``oaicite:{"number":3,"metadata":{"title":"puppeteer-pdf-crawler/gedeonCrawler.ts at master · Gederooney/puppeteer-pdf-crawler · GitHub","url":"https://github.com/Gederooney/puppeteer-pdf-crawler/blob/master/src/gedeonCrawler.ts","text":"import { Browser, Page } from \"puppeteer\";  \n import { processBatch, sleep } from \"./process\";  \n\n const fs = require(\"fs\");  \n const FileType = require(\"file-type\");  \n\n const config = require(\"config\");  \n const path = require(\"path\");  \n\n import { Logger } from \"tslog\";  \n import { PuppeteerUtils } from \"./PuppeteerUtils\";  \n const log = new Logger({ name: \"gedeon crowler","pub_date":null}}``&#8203;.

## How to Run

There are a few steps to get started with this project:

1. Clone the repository
2. Install dependencies using `npm install`
3. Run the crawler using `npm run start`

Please note that this is a general description and may require adjustments based on your specific setup.

## Known Issues

- In the `process.ts` file, there are some issues with the `run` method that need to be addressed (I was not able to quote the problematic lines due to a technical issue).

## Contributions

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or features to suggest.
