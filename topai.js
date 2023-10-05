import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData) => {
  const csv = parse(csvData)
  writeFileSync('topai.csv', csv);
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
await page.goto("https://topai.tools/browse");
await page.waitForTimeout(400000);
const item_len = await page.$$eval('div#tools_gallery div.justify-content-center', els => els.length);
for (let i = 0; i < item_len; i++) {
  const sub_item_len = await page.$$eval('div#tools_gallery div.justify-content-center:nth-child(' +(i) +') div.tool_box', els => els.length);
  for (let j = 0; j < sub_item_len; j++) {
    try {
      const tool_name = await page.$eval('div#tools_gallery div.justify-content-center:nth-child(' +(i) +') div.tool_box:nth-child(' + (j) + ') h5.mt-3 a:nth-child(1)', el => el.innerText);
      const site_url = await page.$eval('div#tools_gallery div.justify-content-center:nth-child(' +(i) +') div.tool_box:nth-child(' + (j) + ') h5.mt-3 a:nth-child(2)', el => el.getAttribute('href'));
      data.push({
        tool_name: tool_name,
        domain: site_url
      });
      console.log(tool_name, site_url);
    } catch (e) {}
  }
}



await browser.close();
saveAsCSV(data);