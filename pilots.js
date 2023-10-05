import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData) => {
  const csv = parse(csvData)
  writeFileSync('pilots.csv', csv);
}
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
await page.goto("https://dronepilotscentral.com/");
await page.waitForTimeout(5000);

const data = [];
for (let i = 1; i <= 58; i++) {
  if (i === 1) {
    await page.goto("https://dronepilotscentral.com/pilots");
    await page.waitForTimeout(5000);
    const len = await page.$$eval('div.geodir-loop-container div.geodir-listing-posts div.geodir-post', els => els.length);
    for (let j = 0; j < len; j++) {
      const title = await page.$eval('div.geodir-loop-container div.geodir-listing-posts div.geodir-post:nth-child(' + (j+1) + ') div.card div.card-body div.geodir-post-title h2.geodir-entry-title a', el => el.innerText);
      const address = await page.$eval('div.geodir-loop-container div.geodir-listing-posts div.geodir-post:nth-child(' + (j+1) + ') div.card div.card-body div.geodir-output-location div.geodir-output-location-listing div.geodir-field-address span[itemprop=streetAddress]', el => el.innerText);
      const region = await page.$eval('div.geodir-loop-container div.geodir-listing-posts div.geodir-post:nth-child(' + (j+1) + ') div.card div.card-body div.geodir-output-location div.geodir-output-location-listing div.geodir-field-address span[itemprop=addressRegion]', el => el.innerText);
      const content = await page.$eval('div.geodir-loop-container div.geodir-listing-posts div.geodir-post:nth-child(' + (j+1) + ') div.card div.card-body div.geodir-post-content-container div.geodir-field-post_content', el => {
        const temp = el.innerText;
        const idx = temp.indexOf('<a');
        if (idx > -1) return temp.substring(0, idx);
        else return temp;
      });

      data.push({
        title: title,
        address: address,
        region: region,
        content: content
      });
    }
  }
  else {
    await page.goto(`https://dronepilotscentral.com/pilots/page/${i}/`);
    await page.waitForTimeout(5000);
    const len = await page.$$eval('div.geodir-loop-container div.geodir-listing-posts div.geodir-post', els => els.length);
    for (let j = 0; j < len; j++) {
      const title = await page.$eval('div.geodir-loop-container div.geodir-listing-posts div.geodir-post:nth-child(' + (j+1) + ') div.card div.card-body div.geodir-post-title h2.geodir-entry-title a', el => el.innerText);
      const address = await page.$eval('div.geodir-loop-container div.geodir-listing-posts div.geodir-post:nth-child(' + (j+1) + ') div.card div.card-body div.geodir-output-location div.geodir-output-location-listing div.geodir-field-address span[itemprop=streetAddress]', el => el.innerText);
      const region = await page.$eval('div.geodir-loop-container div.geodir-listing-posts div.geodir-post:nth-child(' + (j+1) + ') div.card div.card-body div.geodir-output-location div.geodir-output-location-listing div.geodir-field-address span[itemprop=addressRegion]', el => el.innerText);
      const content = await page.$eval('div.geodir-loop-container div.geodir-listing-posts div.geodir-post:nth-child(' + (j+1) + ') div.card div.card-body div.geodir-post-content-container div.geodir-field-post_content', el => {
        const temp = el.innerText;
        const idx = temp.indexOf('<a');
        if (idx > -1) return temp.substring(0, idx);
        else return temp;
      });

      data.push({
        title: title,
        address: address,
        region: region,
        content: content
      });
    }
  }
}
console.log(data);

await browser.close();
saveAsCSV(data);




