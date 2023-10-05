import puppeteer from "puppeteer-extra";

// Add stealth plugin and use defaults
import pluginStealth from 'puppeteer-extra-plugin-stealth';
import {executablePath} from 'puppeteer';
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
// Use stealth
puppeteer.use(pluginStealth())
const saveAsCSV = (csvData) => {
  if (csvData.length > 0) {
    const csv = parse(csvData)
    writeFileSync('newagents.csv', csv);
  }
}
const browser = await puppeteer.launch({
  headless: false,
  executablePath: executablePath()
  /*defaultViewport: null,
  slowMo: 50,
  devtools: false,
  ignoreDefaultArgs: ['--enable-automation'],
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'*/
});

const data = [];

const page = await browser.newPage();
await page.setDefaultNavigationTimeout(0);
await page.goto("https://listreports.com");
await page.waitForTimeout(100);
await page.type('input[type=email]', 'dan@orcahomeloans.com', {delay: 10});
await page.type('input[type=password]', 'Data@123!', {delay: 10});
await page.click('button[type=submit]');
/*
await page.click('div#cookiewall a[data-action=settings]');
await page.waitForTimeout(100);
await page.click('div#cookiewall div.settings a[data-action=accept]');
await page.waitForTimeout(50);

const nav_len = await page.$$eval('div#propertiesWrapper ul.pagination li', els => els.length);

for (let i = 0; i < nav_len - 2; i++) {
  await page.click('div#propertiesWrapper ul.pagination li:nth-child(' + (nav_len) + ')');
  await page.waitForTimeout(50);
  const sub_len = await page.$$eval('div#propertiesWrapper div.row:nth-child(1) div.col-12', els => els.length);
  for (let j = 0; j < sub_len; j++) {
    try {
      const url = await page.$eval('div#propertiesWrapper div.row:nth-child(1) div.col-12:nth-child('+(j)+') a.propertyLink', el =>el.getAttribute('href'));
      const street = await page.$eval('div#propertiesWrapper div.row:nth-child(1) div.col-12:nth-child('+(j)+') figcaption span.street', el =>el.innerText);
      const city = await page.$eval('div#propertiesWrapper div.row:nth-child(1) div.col-12:nth-child('+(j)+') figcaption span.city', el =>el.innerText);
      const price = await page.$eval('div#propertiesWrapper div.row:nth-child(1) div.col-12:nth-child('+(j)+') figcaption span.price', el =>el.innerText);
      const type = await page.$eval('div#propertiesWrapper div.row:nth-child(1) div.col-12:nth-child('+(j)+') figcaption ul li:nth-child(1)', el =>el.innerText);
      const square = await page.$eval('div#propertiesWrapper div.row:nth-child(1) div.col-12:nth-child('+(j)+') figcaption ul li:nth-child(2)', el =>el.innerText);
      const room_number = await page.$eval('div#propertiesWrapper div.row:nth-child(1) div.col-12:nth-child('+(j)+') figcaption ul li:nth-child(3)', el =>el.innerText);
      data.push({
        url: url,
        street: street,
        city: city,
        price: price,
        type: type,
        square: square,
        room_number: room_number
      });
    } catch (e) {}
  }
}*/

await browser.close();
//saveAsCSV(data);