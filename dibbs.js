import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData) => {
  if (csvData.length > 0) {
    const csv = parse(csvData)
    writeFileSync('dibbs.csv', csv);
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

let navNum = calculateX(totalNum, 50);

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

/*const paginationLen = await page.$$eval('table#ctl00_cph1_grdRfqSearch tbody tr.pagination:nth-child(1) td table tbody tr td', els => els.length);
let currentPage = 1;

while (currentPage !== navNum) {
  const paginations = await page.$$('table#ctl00_cph1_grdRfqSearch tbody tr.pagination:nth-child(1) td table tbody tr td');
  let foundTargetPage = false;

  for (const link of paginations) {
    const textContent = await page.evaluate(el => el.textContent, link);

    if (textContent === '...') {
      console.log('.....');
      continue;
    }

    const pageNumber = parseInt(textContent);
    if (pageNumber === navNum) {
      const currentValue = await page.$eval('table#ctl00_cph1_grdRfqSearch tbody tr.pagination:nth-child(1) td table tbody tr td:nth-child(' + currentPage + ')', el => el.innerText.trim());
      if (parseInt(currentValue) === navNum) {
        console.log('final page')
        foundTargetPage = true;
        break;
      }
    }
  }

  if (foundTargetPage) {
    currentPage = navNum;
  } else {
    currentPage++;
    // Assuming there is a next page link, you can click it directly here.
    await page.click('table#ctl00_cph1_grdRfqSearch tbody tr.pagination:nth-child(1) td table tbody tr td:nth-child(' + currentPage + ')');

    if (currentPage > 10) {
      for (let k = 1; k <= paginations.length; k++) {
        const link = paginations[k];
        const item = await page.evaluate(el => el.textContent.trim(), link);

        const itemValue = parseInt(item);
        if (itemValue === currentPage) {
          currentPage = k;
          break;
        }
      }
    }
  }
}*/


/*for (let i = 1; i <= paginationLen; i++) {
  const clickedNavStr = await page.$eval('table#ctl00_cph1_grdRfqSearch tbody tr.pagination:nth-child(1) td table tbody tr td:nth-child(' + i + ')', el => el.innerText.trim())
  if (clickedNavStr === '...'){
    await page.click('table#ctl00_cph1_grdRfqSearch tbody tr.pagination:nth-child(1) td table tbody tr td:nth-child(' + i + ')');
  }
  if (i === parseInt(clickedNavStr))
    await page.click('table#ctl00_cph1_grdRfqSearch tbody tr.pagination:nth-child(1) td table tbody tr td:nth-child(' + i + ')');
  await page.waitForTimeout(1000);
}*/

/* Get all NSN numbers*/
console.log('-------- Date: 2023-12-05 --------')
let currentPage = 1;
navNum =4;
while (currentPage < navNum) {
  let pagination = await page.$$('table#ctl00_cph1_grdRfqSearch tbody tr.pagination:nth-child(1) td table tbody tr td');
  try {
    const clickedStr = await page.$eval('table#ctl00_cph1_grdRfqSearch tbody tr.pagination:nth-child(1) td table tbody tr td:nth-child(' + currentPage + ')', el => el.innerText.trim());
    if (clickedStr !== '...') {

      console.log('----------- Page number: ', clickedStr, ' ------------');
    }
    await page.click('table#ctl00_cph1_grdRfqSearch tbody tr.pagination:nth-child(1) td table tbody tr td:nth-child(' + currentPage + ')');
    await page.waitForTimeout(1000);

    if (clickedStr === '...') {
      pagination = await page.$$('table#ctl00_cph1_grdRfqSearch tbody tr.pagination:nth-child(1) td table tbody tr td');
      for (let k = 0; k < pagination.length; k++) {
        const link = pagination[k];
        const item = await page.evaluate(el => el.textContent.trim(), link);
        const itemValue = parseInt(item);
        if (itemValue === currentPage) {
          currentPage = k + 1;
          break;
        }
      }
    }
    else {

      const trsLen = await page.$$eval('table#ctl00_cph1_grdRfqSearch tbody tr[style="border-color:Gray;border-width:1px;border-style:Solid;"]', els => els.length);
      await page.waitForTimeout(1000);
      //console.log('@@@ ', trsLen)
      const trs = await page.$$('table#ctl00_cph1_grdRfqSearch tbody tr[style*="border-color:Gray;border-width:1px;border-style:Solid;"]');
      for (let i = 0; i < trsLen; i++) {
       // await page.waitForTimeout(10);
        try {
          const tds = await trs[i].$$('table#ctl00_cph1_grdRfqSearch tbody tr[style*="border-color:Gray;border-width:1px;border-style:Solid;"] td');
          const nsnNumber = await tds[1].$eval('a', e => e.innerText.trim());
          const solicitation = await tds[4].$eval('a', e => e.innerText.trim());
        //  await page.waitForTimeout(10);
          console.log('NSN number: ', nsnNumber, '   solicitation: ', solicitation);
          data.push({
            nsn_number: nsnNumber,
            solicitation: solicitation,
            part_number: 'none'
          });
        } catch (e) {}
      }
      //console.log('$$$ ', currentPage);
      currentPage += 1;
    }
    if (currentPage >= navNum) break;
  } catch (e) {}
}
/*data.push({
  nsn_number: '1660-00-620-9102',
  part_number: ''
})
data.push({
  nsn_number: '5130-01-232-3248',
  part_number: ''
})
data.push({
  nsn_number: '5975-01-540-1400',
  part_number: ''
})
data.push({
  nsn_number: '0001S00000053',
  part_number: ''
})
data.push({
  nsn_number: '5180-01-312-7906',
  part_number: ''
})
data.push({
  nsn_number: '1560-01-207-3232',
  part_number: ''
})
data.push({
  nsn_number: '8010-01-285-2492',
  part_number: ''
});
data.push({
  nsn_number: '8010-01-682-0664',
  part_number: ''
});
data.push({
  nsn_number: '8030-01-664-1535',
  part_number: ''
});
data.push({
  nsn_number: '8010-01-681-7475',
  part_number: ''
});
data.push({
  nsn_number: '8010-01-681-7475',
  part_number: ''
});*/

//await page.waitForTimeout(5000);

console.log('----------------------- NSN and part numbers ----------------------------');
await page.goto("https://www.nsnlookup.com/search/national-stock-number-nsn?q=" + data[0].nsn_number + "&scopes=nsn&scopes=part-number&scopes=cage&scopes=keyword");
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
    console.log('NSN number: ', data[count].nsn_number, '   part numbers:  ', data[count].part_number);
  } catch (e) {console.log('')}
  finally {
    count += 1;
  }

}
//console.log(data);
saveAsCSV(data);



