import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData) => {
  if (csvData.length > 0) {
    const csv = parse(csvData)
    writeFileSync('apparelcoalition.csv', csv);
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
await page.goto("https://apparelcoalition.org/manufacturers/");
await page.waitForTimeout(1000);

const len = await page.$$eval('div.facet_grid', els => els.length);

for (let i = 0; i < len; i++) {
  try {
    const url = await page.$eval('div.facet_grid:nth-child(' + i + ') a', el => el.getAttribute('href'))
    data.push({url: url});
    console.log(data)
  } catch (e) {}
}

await browser.close();
saveAsCSV(data);





