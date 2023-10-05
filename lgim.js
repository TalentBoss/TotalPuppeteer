import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
  slowMo: 50,
  devtools: false,
  ignoreDefaultArgs: ['--enable-automation'],
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
});

const page = await browser.newPage();
await page.setDefaultNavigationTimeout(0)
await page.goto("https://fundcentres.lgim.com/en/uk/institutional/fund-centre/PMC/");
await page.waitForTimeout(500);
await page.click('button#onetrust-accept-btn-handler');
await page.click('input');
await page.waitForTimeout(500);
await page.click('button.btn-accept');
await page.waitForTimeout(5000);



await page.waitForSelector('span.download-data');
//await page.click('div#root-d735063d-c1e6-4a26-b03a-2f3df5ffc1c0 div.fc-modal-label-wrapper');
await page.click('span.download-data');
await page.waitForTimeout(2000);
await page.click('span.action-button');

await page.waitForTimeout(5000);
await browser.close();