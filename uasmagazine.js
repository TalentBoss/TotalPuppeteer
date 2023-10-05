import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData) => {
  const csv = parse(csvData)
  writeFileSync('uasmagazine.csv', csv);
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
await page.goto("https://directory.uasmagazine.com/listings/company/");
await page.waitForTimeout(5000);
const final_data = [];
const len = await page.$$eval('div#colLeft div.listing', els => els.length);
for (let i = 4; i < len; i++) {
  let company_name = '';
  let url = '';
  let about_company = '';
  try {
    company_name = await page.$eval('div#colLeft div.listing:nth-child(' + (i+1) + ') div.company a.companyName', el => el.innerText);
  } catch (e) {}
  try {
    url = await page.$eval('div#colLeft div.listing:nth-child(' + (i+1) + ') div.company a:nth-child(3)', el => el.getAttribute('href'));
  } catch (e) {}
  try {
    about_company = await page.$eval('div#colLeft div.listing:nth-child(' + (i+1) + ') div.company p', el => el.innerText);
    if (about_company.trim() === "") about_company = await page.$eval('div#colLeft div.listing:nth-child(' + (i+1) + ') div.company:nth-child(6)', el => el.innerText);
  } catch (e) {}

  final_data.push({
    company_name: company_name.trim(),
    url: url,
    about_company: about_company,
    email: '',
    phone: ''
  });
}


await page.goto("https://directory.uasmagazine.com/listings/search/?search=a");
await page.waitForTimeout(5000);
const extra_data = [];
const search_len = await page.$$eval('div.allListings div.listing', els => els.length);
for (let j = 0; j < search_len; j++) {

  let mail = '';
  let phone = '';
  let company = '';
  try {
    company = await page.$eval('div.allListings div.listing:nth-child(' + (j+1) + ') div.company a.companyName', el => el.innerText);
  } catch (e) {}
  try {
    let temp_mail = await page.$eval('div.allListings div.listing:nth-child(' + (j+1) + ') div.company p a', el => el.getAttribute('href'));
    mail = temp_mail.substring(7).trim();
  } catch (e) {}
  try {
    const total_string = await page.$eval('div.allListings div.listing:nth-child(' + (j+1) + ') div.company p', el => el.innerText);
    let phone_start_pos = 0;
    if (total_string.indexOf('10101') < 0) {
      if (total_string.indexOf('101') > -1) {
        phone_start_pos = total_string.indexOf('101');
        phone = total_string.substring(phone_start_pos + 6).trim();
      }
      else {
        if (total_string.indexOf('01') > -1) {
          phone_start_pos = total_string.indexOf('01');
          phone = total_string.substring(phone_start_pos + 5).trim();
        }
      }
    }
    else {
      phone_start_pos = total_string.indexOf('10101');
      phone = total_string.substring(phone_start_pos + 8).trim();
    }

  } catch (e) {}

  for (let p = 0; p < final_data.length; p++) {
    if (final_data[p].company_name === company.trim()) {
      final_data[p].email = mail;
      final_data[p].phone = phone;
      break;
    }
  }
  /*console.log('@@@', company);
  console.log("$$$", mail);
  console.log("###", phone);*/
}

await browser.close();
saveAsCSV(final_data);