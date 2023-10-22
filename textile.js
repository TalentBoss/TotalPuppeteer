import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData, i) => {
  if (csvData.length > 0) {
    const csv = parse(csvData)
    writeFileSync('textile'+ i +'.csv', csv);
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

let data = [];

const page = await browser.newPage();
await page.setDefaultNavigationTimeout(0);
await page.goto("https://textileexchange.org/find-a-supplier/");
await page.waitForTimeout(1000);

for (let i = 0; i < 5; i++) {

  await page.click('button.c-btn-color-normal');
  await page.waitForTimeout(1000);
  console.log('click time ', i);
}
await page.waitForTimeout(50000);
const article_len = await page.$$eval('div.eight29-posts article', els => els.length);
console.log('$$$  ', article_len)
const EMAIL_REMOVE_STR = 'PRODUCER CONTACT EMAIL:';
const PHONE_REMOVE_STR = 'PRODUCER CONTACT PHONE:';
const WEBSITE_REMOVE_STR = 'PRODUCER CONTACT URL:';

for (let i = 0; i < article_len; i++) {
  try {
    const item_url = await page.$eval('div.eight29-posts article:nth-child(' + i + ') div.eight29-post-body h4 a', el => el.getAttribute('href'));

    //new browser
    const page1 = await browser.newPage();
    await page1.setDefaultNavigationTimeout(0);
    await page1.goto(item_url);
    await page1.waitForTimeout(100);
    let company_name = '';
    let email = '';
    let phone = '';
    let website = '';
    try {
      company_name = await page1.$eval('section.post-news__top div.row div.mx-auto h2', el => el.innerText);
    } catch (e) {}
    try {
      email = await page1.$eval('section.post-news__top div.row div.mx-auto p:nth-child(3)', el => el.innerText);
      email = email.substring(EMAIL_REMOVE_STR.length);
    } catch (e) {}
    try {
      phone = await page1.$eval('section.post-news__top div.row div.mx-auto p:nth-child(4)', el => el.innerText);
      phone = phone.substring(PHONE_REMOVE_STR.length);
    } catch (e) {}
    try {
      website = await page1.$eval('section.post-news__top div.row div.mx-auto p:nth-child(5)', el => el.innerText);
      website = website.substring(WEBSITE_REMOVE_STR.length);
    } catch (e) {}
    //const url = await page.$eval('div.facet_grid:nth-child(' + i + ') a', el => el.getAttribute('href'))
    data.push({
      company_name: company_name,
      email: email,
      phone: phone,
      website: website
    });
    console.log(company_name, email, phone, website);
    if (data.length > 30) {
      saveAsCSV(data, i+1);
      data = [];
    }

    await page1.close();
  } catch (e) {}
}

saveAsCSV(data, 'aaaa')

await browser.close();





