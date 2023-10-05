import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData) => {
  const csv = parse(csvData)
  writeFileSync('cbdhemp.csv', csv);
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
await page.goto("https://cbdhemp.direct/shop");
await page.waitForTimeout(15000);

const data = [];

const listLength = await page.$$eval('div#primary div.ast-woocommerce-container ul.products li.ast-grid-common-col', els => els.length);
console.log('@@@length', listLength);
for (let i = 0; i < listLength; i++) {
  let product_name = '';
  let url = '';
  let origin_price = '';
  let current_price = '';
  try {
    product_name = await page.$eval('div#primary div.ast-woocommerce-container ul.products li.ast-grid-common-col:nth-child(' + (i+1) + ') div.astra-shop-summary-wrap a.ast-loop-product__link h2.woocommerce-loop-product__title', el => el.innerText);
  } catch (e) {}
  try {
    url = await page.$eval('div#primary div.ast-woocommerce-container ul.products li.ast-grid-common-col:nth-child(' + (i+1) + ') div.astra-shop-summary-wrap a.ast-loop-product__link', el => el.getAttribute('href'));
  } catch (e) {}
  try {
    let total = await page.$eval('div#primary div.ast-woocommerce-container ul.products li.ast-grid-common-col:nth-child(' + (i+1) + ') div.astra-shop-summary-wrap span.price', el => el.innerText);
    const total_string = total.trim();

    if (total_string.indexOf(' – ') > 0) {
      current_price = total_string;
      origin_price = total_string;
    }
    else {
      if (total_string.indexOf(' ') > 0) {
        const pos = total.indexOf(' ');
        origin_price = total_string.substring(0, pos);
        current_price = total_string.substring(pos + 1);
      }
      else {
        current_price = total_string;
        origin_price = total_string;
      }
    }

  } catch (e) {}
  console.log(origin_price, current_price);
  data.push({
    product_name: product_name.trim(),
    url: url,
    origin_price: origin_price,
    current_price: current_price
  });


}
await browser.close();
saveAsCSV(data);