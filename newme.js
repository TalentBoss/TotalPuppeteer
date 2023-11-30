import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData) => {
  if (csvData.length > 0) {
    const csv = parse(csvData)
    writeFileSync('newme.csv', csv);
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
await page.goto("https://newme.asia/collection/indofusion/?orderby=menu_order");
await page.waitForTimeout(500);
/*let count = 0;
const timer = setInterval(async () => {
  if (count < 15) {
    await page.keyboard.press('Escape');
    await page.mouse.move(
      500,
      300
    );
    await page.mouse.wheel({deltaY: 20000});
    count += 1;
  }
  else clearInterval(timer);
}, 1000);
await page.waitForTimeout(18000);*/

//const productNum = await page.$$eval('div#products div.css-jgblh0 div.css-1jke4yk', els => els.length);
const productNum = await page.$$eval('div#products div[style="margin-bottom: 20px; max-width: 48%;"]', els => els.length)
await page.waitForTimeout(2000);
console.log("@@@@@ ", productNum);
await page.click('div#products div[style="margin-bottom: 20px; max-width: 48%;"]:nth-child('+ (2) + ') div.css-1jke4yk div.css-79elbk');

await page.keyboard.press('Escape');
await page.waitForTimeout(2000);
const imagesNum = await page.$$eval('ul li', els => els.length);
console.log('^^^^^  ', imagesNum);
const imageUrlsArray = [];
let imageUrlsStr = '';
await page.waitForTimeout(2000);
for (let j = 1; j <= imagesNum; j++) {
  const imgUrl = await page.$eval('ul li:nth-child(' + (j) + ') img', el => el.getAttribute('src'));
  await page.waitForTimeout(500);
  //console.log(imgUrl);
  imageUrlsArray.push(imgUrl);
}
imageUrlsStr = imageUrlsArray.toLocaleString();

const price = await page.$eval('div.css-1n17gme div.css-etr15i', el => el.innerText);
let discountedPrice = 'None';
try {
  discountedPrice = await page.$eval('div.css-1n17gme div.css-1remtah', el => el.innerText);
} catch (e) {}

const selectSizeArray = [];
let selectSizeStr = '';
const selectSizeNum = await page.$$eval('div.css-1ttafeu div.MuiBox-root', els => els.length);
for (let j = 1; j <= selectSizeNum; j++) {
  const selectSize = await page.$eval('div.css-1ttafeu div.MuiBox-root:nth-child(' + (j) + ')', el => el.innerText);
  selectSizeArray.push(selectSize);
}
selectSizeStr = selectSizeArray.toLocaleString();

let fastDeliveryDay = 'None';
try {
  fastDeliveryDay = await page.$eval('div.css-m8azze div.css-92gn3', el => el.innerText);
} catch (e) {}

await page.click('div.css-18445q6');
const specifications = await page.$$eval('div.css-mgknhi div.css-whgct', els => els.length);
console.log('$$$$$$$$  ', price, specifications);



