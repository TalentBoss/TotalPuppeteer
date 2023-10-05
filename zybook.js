import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData) => {
  if (csvData.length > 0) {
    const csv = parse(csvData)
    writeFileSync('real_estate.csv', csv);
  }
}
const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
  slowMo: 50,
  devtools: false,
  ignoreDefaultArgs: ['--enable-automation'],
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
});

const data = [];

const page = await browser.newPage();
await page.setDefaultNavigationTimeout(0);
await page.goto("https://learn.zybooks.com/signin");
await page.waitForTimeout(100);

const emailElement = await page.$('input[type=email]');
await emailElement.type('bob.johnson202234@gmail.com');
await page.waitForTimeout(20);
const passwordElement = await page.$('input[type=password]');
await passwordElement.type('Johnson123!');

await page.waitForTimeout(20);
await page.click('button[type=button]');

await page.waitForTimeout(20);
await page.goto("https://learn.zybooks.com/library");
await page.waitForTimeout(20);
const sectionLength = await page.$$eval('div.centered-content section', els => els.length);
for (let i = 1; i < sectionLength + 1; i++) {
  if (i === 4) {
    await page.$eval('div.centered-content section:nth-child('+(i)+') div a', el => el);// this code is very important!!
    await page.click('div.centered-content section:nth-child('+(i)+') div a'); // this code is very important!!!
  }

}








