import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData) => {
  if (csvData.length > 0) {
    const csv = parse(csvData)
    writeFileSync('real_estate.csv', csv);
  }
}


const calculateX = (total_number, unit_number) => {
  if (unit_number === 0) {
    throw new Error("unit_number cannot be zero");
  }

  let x = Math.ceil(total_number / unit_number); // Using Math.ceil to round up to the nearest whole number

  while (x * unit_number < total_number) {
    x++;
  }

  return x;
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
await page.goto("https://www.dibbs.bsm.dla.mil/");
await page.waitForTimeout(100);
await page.click('input#butAgree');
await page.goto("https://www.dibbs.bsm.dla.mil/RFQ/RfqRecs.aspx?category=close&TypeSrch=dt&Value=12-05-2023");

const totalNumStr = await page.$eval('span#ctl00_cph1_lblRecCount strong', el => el.innerText);
const totalNum = parseInt(totalNumStr.trim());

const navNum = calculateX(totalNum, 50);

/*console.log(totalNum, navNum);
const trsLen = await page.$$eval('table#ctl00_cph1_grdRfqSearch tbody tr[style="border-color:Gray;border-width:1px;border-style:Solid;"]', els => els.length);
await page.waitForTimeout(1000);
console.log(trsLen)
const trs = await page.$$('table#ctl00_cph1_grdRfqSearch tbody tr[style*="border-color:Gray;border-width:1px;border-style:Solid;"]');
for (let i = 0; i < trsLen; i++) {
  await page.waitForTimeout(100);
  const tds = await trs[i].$$('table#ctl00_cph1_grdRfqSearch tbody tr[style*="border-color:Gray;border-width:1px;border-style:Solid;"] td');
  const nsnNumber = await tds[1].$eval('a', e => e.innerText.trim());
  const solicitation = await tds[4].$eval('a', e => e.innerText.trim());
  await page.waitForTimeout(100);
  console.log(nsnNumber, solicitation);
}*/


const paginationLen = await page.$$eval('table#ctl00_cph1_grdRfqSearch tbody tr.pagination:nth-child(1) td table tbody tr td', els => els.length);
const paginations = await page.$$('table#ctl00_cph1_grdRfqSearch tbody tr.pagination:nth-child(1) td table tbody tr td');
console.log(paginationLen);
if (paginationLen > 10) {
  for (let i = 1; i <= paginationLen; i++) {
    const clickedNavStr = await page.$eval('table#ctl00_cph1_grdRfqSearch tbody tr.pagination:nth-child(1) td table tbody tr td:nth-child(' + i + ')', el => el.innerText.trim())
    if (clickedNavStr === '...'){}
    if (i === parseInt(clickedNavStr))
    await page.click('table#ctl00_cph1_grdRfqSearch tbody tr.pagination:nth-child(1) td table tbody tr td:nth-child(' + i + ')');
    await page.waitForTimeout(1000);
  }
}


