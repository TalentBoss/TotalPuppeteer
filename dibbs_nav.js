import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData) => {
  if (csvData.length > 0) {
    const csv = parse(csvData)
    writeFileSync('dibbs-nav.csv', csv);
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
await page.goto("https://dibbsnav.com/");
await page.waitForTimeout(100);
await page.click('input#btnLogin');
await Promise.all([
  await page.waitForSelector('input#Main_Input_Customer_Name'),
  await page.waitForSelector('input#Main_Input_Password')
]);
const userNameElement = await page.$('input#Main_Input_Customer_Name');
const passwordElement = await page.$('input#Main_Input_Password')

await userNameElement.type('hui_ren');
await passwordElement.type('d4337c');

await page.waitForTimeout(1000);
await page.click('input#Main_btnCustOK');
await page.waitForTimeout(8000);

let currentPage = 1;
const navLen = await page.$$eval('tr[style="color:Black;background-color:White;font-weight:bold;"] table tbody tr td', el => el.length);
await page.waitForTimeout(8000);
console.log('Pages number: ', navLen);
console.log('NSN Number',' | ',  'Solicitation', ' | ', 'Unit Price', ' | ', 'ExtendedPrice', ' | ', 'Nomenclature', ' | ', 'QTY', ' | ', 'Unit Issue', ' | ', 'NAICS', ' | ', 'Supplier Restriction', ' | ', 'Del Days');
while (currentPage <= navLen) {
  await page.click('tr[style="color:Black;background-color:White;font-weight:bold;"] table tbody tr td:nth-child(' + currentPage + ')');
  await page.waitForTimeout(10000);

  try {
    const navLen = await page.$$eval('tr[style="color:Black;background-color:White;font-weight:bold;"] table tbody tr td', el => el.length);

    const trs = await page.$$('table#Main_GridView1 tbody tr#Main_GridView1');
    for (let i = 0; i < trs.length; i++) {
      const tds = await trs[i].$$('td');
      let nsnNumber = '', solicitation ='', unitPrice = '', extendedPrice = '', nomenclature = '', qty = '', unitIssue = '', naics = '', supplierRestriction = '', delDays = '';
      try {
        nsnNumber = await page.evaluate(el => el.textContent.trim(), tds[13]);
      } catch (e) {}
      try {
        solicitation = await page.evaluate(el => el.textContent.trim(), tds[0]);
      } catch (e) {}
      try {
        unitPrice = await page.evaluate(el => el.textContent.trim(), tds[8]);
      } catch (e) {}
      try {
        extendedPrice = await page.evaluate(el => el.textContent.trim(), tds[10]);
      } catch (e) {}
      try {
        nomenclature = await page.evaluate(el => el.textContent.trim(), tds[4]);
      } catch (e) {}
      try {
        qty = await page.evaluate(el => el.textContent.trim(), tds[6]);
      } catch (e) {}
      try {
        unitIssue = await page.evaluate(el => el.textContent.trim(), tds[7]);
      } catch (e) {}
      try {
        naics = await page.evaluate(el => el.textContent.trim(), tds[28]);
      } catch (e) {}
      try {
        supplierRestriction = await page.evaluate(el => el.textContent.trim(), tds[20]);
      } catch (e) {}
      try {
        delDays = await page.evaluate(el => el.textContent.trim(), tds[12]);
      } catch (e) {}
      console.log(nsnNumber,' | ', solicitation,' | ', unitPrice,' | ', extendedPrice,' | ', nomenclature,' | ', qty,' | ', unitIssue,' | ', naics,' | ', supplierRestriction,' | ', delDays);
      data.push({
        nsn_number: nsnNumber,
        part_number: '',
        solicitation: solicitation,
        unit_price: unitPrice,
        extended_price: extendedPrice,
        nomenclature: nomenclature,
        qty: qty,
        unit_issue: unitIssue,
        naics: naics,
        supplier_restriction: supplierRestriction,
        del_days: delDays
      })
    }
    console.log(trs.length)
  } catch (e) {}
  finally {
    currentPage += 1;
  }
}
await page.waitForTimeout(5000);

console.log('----------------------- Final Results ----------------------------');
await page.goto("https://www.nsnlookup.com/search/national-stock-number-nsn?q=" + data[0].nsn_number + "&scopes=nsn&scopes=part-number&scopes=cage&scopes=keyword");
await page.waitForTimeout(5000);
let count = 0;
while (count < data.length) {
  try {
    await page.goto("https://www.nsnlookup.com/search/national-stock-number-nsn?q=" + data[count].nsn_number + "&scopes=nsn&scopes=part-number&scopes=cage&scopes=keyword");
    await page.waitForTimeout(1000);

    const uls = await page.$$('ul.list-unstyled');
    let partNumbers = [];
    if (uls.length > 0) {
      try {
        const lis = await uls[0].$$('li');
        if (lis.length > 0) {
          for (let k = 0; k < lis.length; k++) {
            const partNumber = await lis[k].$eval('a[rel=nofollow]', el => el.innerText.trim());

            if (partNumbers.indexOf(partNumber) < 0) partNumbers.push(partNumber);
          }
          //console.log('part numbers', partNumbers);
        }
      } catch (e) {console.log('')}
    }
    data[count].part_number = partNumbers.toLocaleString();
    console.log(data[count].nsn_number,' | ', data[count].part_number, ' | ', data[count].solicitation,' | ', data[count].unit_price,' | ', data[count].extended_price,' | ', data[count].nomenclature,' | ', data[count].qty,' | ', data[count].unit_issue,' | ', data[count].naics,' | ', data[count].supplier_restriction,' | ', data[count].del_days);
  } catch (e) {console.log('')}
  finally {
    count += 1;
  }

}
//console.log(data);
saveAsCSV(data);

console.log('--------------- End ----------------')
/*console.log('NSN Number',' | ',  'Solicitation', ' | ', 'Unit Price', ' | ', 'ExtendedPrice', ' | ', 'Nomenclature', ' | ', 'QTY', ' | ', 'Unit Issue', ' | ', 'NAICS', ' | ', 'Supplier Restriction', ' | ', 'Del Days');
try {
  const navLen = await page.$$eval('tr[style="color:Black;background-color:White;font-weight:bold;"] table tbody tr td', el => el.length);
  //console.log(navLen);
  const trs = await page.$$('table#Main_GridView1 tbody tr#Main_GridView1');
  for (let i = 0; i < trs.length; i++) {
    const tds = await trs[i].$$('td');
    let nsnNumber = '', solicitation ='', unitPrice = '', extendedPrice = '', nomenclature = '', qty = '', unitIssue = '', naics = '', supplierRestriction = '', delDays = '';
    try {
      nsnNumber = await page.evaluate(el => el.textContent.trim(), tds[13]);
    } catch (e) {}
    try {
      solicitation = await page.evaluate(el => el.textContent.trim(), tds[0]);
    } catch (e) {}
    try {
      unitPrice = await page.evaluate(el => el.textContent.trim(), tds[8]);
    } catch (e) {}
    try {
      extendedPrice = await page.evaluate(el => el.textContent.trim(), tds[10]);
    } catch (e) {}
    try {
      nomenclature = await page.evaluate(el => el.textContent.trim(), tds[4]);
    } catch (e) {}
    try {
      qty = await page.evaluate(el => el.textContent.trim(), tds[6]);
    } catch (e) {}
    try {
      unitIssue = await page.evaluate(el => el.textContent.trim(), tds[7]);
    } catch (e) {}
    try {
      naics = await page.evaluate(el => el.textContent.trim(), tds[28]);
    } catch (e) {}
    try {
      supplierRestriction = await page.evaluate(el => el.textContent.trim(), tds[20]);
    } catch (e) {}
    try {
      delDays = await page.evaluate(el => el.textContent.trim(), tds[12]);
    } catch (e) {}
    console.log(nsnNumber,' | ', solicitation,' | ', unitPrice,' | ', extendedPrice,' | ', nomenclature,' | ', qty,' | ', unitIssue,' | ', naics,' | ', supplierRestriction,' | ', delDays);
  }
  console.log(trs.length)
} catch (e) {}*/


