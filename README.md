# Puppeteer PDF Crawler

This project is a tool for crawling and downloading PDF files using Puppeteer.

## Overview

The Puppeteer PDF Crawler is designed to connect to specific accounts, search for profiles, and fetch relevant data. It is built using TypeScript and utilizes the Puppeteer library.

## Configuration

Configuration options are available in the `config` directory. `default.json` file contains the information required to connect to specific accounts. It includes fields for email, password, and URL for each account&#8203;

## Code Structure

The main entry point of the application is the `index.ts` file in the `src` directory. It initializes a new instance of the `Crawler` class and launches the browser using Puppeteer&#8203;.

The `crawler.ts` file defines the `Crawler` class, which contains the core functionality of the crawler. It can connect to an account, search for profiles, and fetch profile data&#8203;.

## How to Run

There are a few steps to get started with this project:

1. Clone the repository
2. Install dependencies using `npm install`
3. Run the crawler using `npm run start`

Please note that this is a general description and may require adjustments based on your specific setup.

