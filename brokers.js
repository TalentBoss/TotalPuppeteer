import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData, num) => {
  if (csvData.length > 0) {
    const csv = parse(csvData)
    writeFileSync('brokers'+num+'.csv', csv);
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
let num = 0;
const front_url = 'https://www.bizbuysell.com/business-brokers/directory/';
const end_url = '/?q=bGM9SmtjOU1qQW1RejFWVXlaVFBVTkJQeVpIUFRJd0prTTlWVk1tVXoxVVdEOG1SejB5TUNaRFBWVlRKbE05UTA4L0prYzlNakFtUXoxVlV5WlRQVTVE';
const page = await browser.newPage();
await page.setDefaultNavigationTimeout(0);
//await page.goto("https://www.bizbuysell.com/business-brokers/directory/?q=bGM9SmtjOU1qQW1RejFWVXlaVFBVTkJQeVpIUFRJd0prTTlWVk1tVXoxVVdEOG1SejB5TUNaRFBWVlRKbE05UTA4L0prYzlNakFtUXoxVlV5WlRQVTVE");

//california, florida, texas, colorado
await page.waitForTimeout(400);
for (let j = 1; j <= 60; j++) {
  await page.goto(front_url + j + end_url);
  await page.waitForTimeout(10);
  const len = await page.$$eval('app-bfs-brokercard-search-result-container app-bfs-elite-brokercard-search-result', els => els.length);
  for (let i = 1; i < len+1; i++) {
    let item_url = '';
    try {
      item_url = await page.$eval('app-bfs-brokercard-search-result-container app-bfs-elite-brokercard-search-result:nth-child('+(i)+') a.ng-star-inserted', el => el.getAttribute('href').trim());
    } catch (e) {}
    let name = '';
    try {
      name = await page.$eval('app-bfs-brokercard-search-result-container app-bfs-elite-brokercard-search-result:nth-child('+(i)+') a.ng-star-inserted div.elite-member-card div.info-container div.name', el => el.innerText);

    } catch (e) {}
    let duty = '';
    try {
      duty = await page.$eval('app-bfs-brokercard-search-result-container app-bfs-elite-brokercard-search-result:nth-child('+(i)+') a.ng-star-inserted div.elite-member-card div.info-container div.location', el => el.innerText);
    } catch (e) {}

    let location = '';
    try {
      location = await page.$eval('app-bfs-brokercard-search-result-container app-bfs-elite-brokercard-search-result:nth-child('+(i)+') a.ng-star-inserted div.elite-member-card div.info-container div.tag_style_2', el => el.innerText);
    } catch (e){}

    let phone = '';
    let license = '';
    if (item_url !== '') {
      await page.goto('https://www.bizbuysell.com/' + item_url);
      await page.waitForTimeout(2);
      try {
        phone = await page.$eval('a#brokerPhoneHref span', el => el.innerText);
      } catch (e) {}
      try {
        license = await page.$eval('div#profileContainer span.brokerLicense', el => el.innerText.trim());
      } catch (e) {}
      await page.goto(front_url + j + end_url);
    }
    if (data.length > 100) {
      num += 1;
      saveAsCSV(data, num);
      await page.waitForTimeout(200);
      data = [];
    } else {
      data.push({
        name: name,
        duty: duty,
        location: location,
        phone: phone,
        url: item_url
      });
    }
  }
}



console.log(data);

await browser.close();

