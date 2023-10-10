import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData) => {
  const csv = parse(csvData)
  writeFileSync('valid0-10000.csv', csv);
}

const generateCombinations = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const combinations = [];

  for (let i = 0; i < characters.length; i++) {
    for (let j = 0; j < characters.length; j++) {
      for (let k = 0; k < characters.length; k++) {
        const combination = characters[i] + characters[j] + characters[k];
        combinations.push(combination);
      }
    }
  }

  return combinations;
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
await page.setDefaultNavigationTimeout(0);
const common_front_url = 'https://vplates.com.au/create/check-combination?combination=';
const common_back_url = '&vehicleType=car';


const data = [];
const combination = generateCombinations();
//const combination = ['KCXU', 'AA8', 'BC3'];
let count = 3080;
while (count < 10000) {
  await page.goto(common_front_url + combination[count] + common_back_url);
  await page.waitForTimeout(2000);
  //const inputElement = await page.$('#combination');
  //await inputElement.type(combination[count]);
  //await page.waitForSelector('button.button--full-width');
  try {
    await page.click('button.button--full-width');
    await page.waitForTimeout(2000);
    //await page.keyboard.press('Enter');
    try {
      //const len = await page.$$eval("div[role='region'] div.info-box--max-450", els => els.length);
      const el = await page.$eval("div.combination-checker__combo-container--ticked", el => el);
      console.log('success    -   ', count)
      //const text = await (await divElement.getProperty('textContent')).jsonValue()
      /*
       if (text.indexOf('This combo’s not available') > 0) {
         //await page.click('div.combination-checker__actions button.button--tertiary');
         console.log('fail')
       }
       else if (text.indexOf('Your plate combo’s available!') > 0) {
         console.log('success')
       }*/

      /*await page.waitForTimeout(500);
      await page.click('div.combination-checker__actions button.button--tertiary');*/
      data.push({
        valid: combination[count]
      });
    } catch (e) {
      console.log('failed')
    }
    finally {
      count += 1;
    }
  } catch (e) {
    count += 1;
  }
}
await browser.close();
saveAsCSV(data);