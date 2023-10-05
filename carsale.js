import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData) => {
  if (csvData.length > 0) {
    const csv = parse(csvData)
    writeFileSync('real_estate.csv', csv);
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


const url_array = [
  'https://www.autoscout24.de/angebote/bmw-420-4er-420i-cabrio-aut-sport-line-gasoline-black-3f560073-63f1-407c-85b2-8de252cc988f',
  'https://www.autoscout24.de/angebote/volkswagen-golf-gti-2-0-tsi-gasoline-black-d57e94fb-7a72-4fc6-878c-54c6a2404963',
  'https://www.autoscout24.de/angebote/skoda-fabia-1-0-tsi-dsg-ambition-klima-div-extras-tuev-neu-gasoline-grey-73cad4fe-96ae-491b-ae25-80e0f40e81e7'
];
await page.waitForTimeout(3);
await page.goto(url_array[0]);
await page.click('div._acceptance-buttons_1i5cd_82 button._consent-accept_1i5cd_111');
for (let i = 0; i < url_array.length; i++) {
  await page.goto(url_array[i]);
  await page.waitForTimeout(3);

  try {
    const brand = await page.$eval('div.StageTitle_makeModelContainer__WPHjg span:nth-child(1)', el => el.innerText.trim());
    const model = await page.$eval('div.StageTitle_modelVersion__Rmzgd', el => el.innerText.trim());
    data.push({
      brand: brand,
      model: model
    });
    console.log('$$$$$$ ', brand, model);
  } catch (e){}
}


await browser.close();
saveAsCSV(data);



