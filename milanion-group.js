import puppeteer from "puppeteer";
import WebSocket from "ws";


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
await page.goto("https://www.unmannedsystemstechnology.com/company/milanion-group/");
//await page.waitForTimeout(5000);
await page.waitForSelector('div.supplier-box-title');
const companyName = await page.$eval('div.supplier-box-title', el => el.innerText);
const data = [];
const systemLength = await page.$$eval('nav.chapter-toc ul li', els => els.length);

for (let i = 0; i < systemLength; i++) {
  const systemName = await page.$eval('nav.chapter-toc ul li:nth-child(' + (i+1) + ') a', el => el.innerHTML);
  data.push({
    System: systemName,
    Producer: companyName
  });
}

console.log('sdfsdfsdfsd ', data);
await browser.close();




