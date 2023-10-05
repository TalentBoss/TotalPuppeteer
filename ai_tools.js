import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData) => {
  const csv = parse(csvData)
  writeFileSync('ai_tools.csv', csv);
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
await page.goto("https://www.futurepedia.io/");
await page.waitForTimeout(800000);
const item_len = await page.$$eval('div.InfiniteScroll div.MuiGrid-container div.css-12y6uts', els => els.length);
for (let i = 0; i < item_len; i++) {
  try {
    const tool_name = await page.$eval('div.InfiniteScroll div.MuiGrid-container div.css-12y6uts:nth-child('+(i) + ') h3.css-nxqa8p', el => el.innerText);
    const site_url = await page.$eval('div.InfiniteScroll div.MuiGrid-container div.css-12y6uts:nth-child('+(i) + ') a.css-p9t5dc', el => {
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