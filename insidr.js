import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData) => {
  const csv = parse(csvData)
  writeFileSync('insidr.csv', csv);
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
await page.goto("https://www.insidr.ai/full-ai-tools-list/");
await page.waitForTimeout(1000);
const item_len = await page.$$eval('table#tablepress-1 tbody tr', els => els.length);
for (let i = 0; i < item_len; i++) {
  /*const td_len = await page.$$eval('table#tablepress-1 tbody tr:nth-child('+(i) +') td', els => els.length);
  for (let j = 0; j < td_len; j++) {}*/
  try {
    const tool_name = await page.$eval('table#tablepress-1 tbody tr:nth-child('+(i) +') td:nth-child(1)', el => el.innerText);
    const site_url = await page.$eval('table#tablepress-1 tbody tr:nth-child('+(i) +') td:nth-child(2) a', el => el.getAttribute('href').trim());
    data.push({
      tool_name: tool_name,
      domain: site_url
    });
    console.log(tool_name, site_url);
  } catch (e) {}
}


await browser.close();
saveAsCSV(data);