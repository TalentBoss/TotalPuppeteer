import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData) => {
  const csv = parse(csvData)
  writeFileSync('future_tools.csv', csv);
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
await page.goto("https://www.futuretools.io/");
await page.waitForTimeout(800000);
const item_len = await page.$$eval('div.jetboost-list-wrapper-vq3k div[role=list] div[role=listitem]', els => els.length);
for (let i = 0; i < item_len; i++) {
  try {
    const tool_name = await page.$eval('div.jetboost-list-wrapper-vq3k div[role=list] div[role=listitem]:nth-child('+(i) + ') div.tool-item-columns---new div.tool-item-coliumn-2---new div.tool-item-text-link-block---new a.tool-item-link---new', el => el.innerText);
    const site_url = await page.$eval('div.jetboost-list-wrapper-vq3k div[role=list] div[role=listitem]:nth-child('+(i) + ') div.tool-item-columns---new div.tool-item-coliumn-2---new div.tool-item-text-link-block---new a.tool-item-new-window---new', el => {
      const url_str = el.getAttribute('href').trim();
      const pos = url_str.lastIndexOf('/');
      //return url_str.substring(0, pos);
      return url_str;
    });
    data.push({
      tool_name: tool_name,
      domain: site_url
    });
    console.log(tool_name, site_url);
  } catch (e) {}
}


await browser.close();
saveAsCSV(data);