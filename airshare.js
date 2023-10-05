import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData) => {
  const csv = parse(csvData)
  writeFileSync('airshare.csv', csv);
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
await page.goto("https://www.airshare.co.nz/marketplace/search");
await page.waitForTimeout(5000);

const len = await page.$$eval('div.results div.row div.col-sm-4', els => els.length);
const data = [];
for (let i = 0; i < len; i++) {
  const place = await page.$eval('div.results div.row div.col-sm-4:nth-child(' + (i+1) + ') div.listing-box h3', el => el.innerText);
  const address = await page.$eval('div.results div.row div.col-sm-4:nth-child(' + (i+1) + ') div.listing-box div.address p', el => el.innerText);
  const phone = await page.$eval('div.results div.row div.col-sm-4:nth-child(' + (i+1) + ') div.listing-box div.phone', el => el.innerText);
  const number = await page.$eval('div.results div.row div.col-sm-4:nth-child(' + (i+1) + ') div.listing-box div.listing-footer div.flights i span strong', el => el.innerText);
  const review = await page.$eval('div.results div.row div.col-sm-4:nth-child(' + (i+1) + ') div.listing-box div.listing-footer div.reviews div.starrr', el => el.getAttribute("data-rating"));
  let url = 'none';
  try {
    const temp_url = await page.$eval('div.results div.row div.col-sm-4:nth-child(' + (i+1) + ') div.listing-box div.header-image', el => el.getAttribute('style'));
    const url_pos = temp_url.indexOf('https');
    url = temp_url.substring(url_pos, temp_url.length - 1).trim();
  } catch (e) {
    
  }
  
  data.push({
    place: place,
    address: address,
    phone: phone,
    number: number,
    review: review,
    url: url
  });
  console.log(url);

}
console.log(data);

await browser.close();
saveAsCSV(data);




