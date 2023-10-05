import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';
const saveAsCSV = (csvData) => {
  const csv = parse(csvData)
  writeFileSync('consumer.csv', csv);
}
const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
  slowMo: 50,
  devtools: false,
  ignoreDefaultArgs: ['--enable-automation'],
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
});

let count = 0;
const data = [];
const id_string =
  '1084315\n' +
  '836629\n' +
  '1895714\n' +
  '1980819\n' +
  '2509756\n' +
  '1632991\n' +
  '209878\n' +
  '1253395\n' +
  '571787\n' +
  '2021414\n' +
  '859744\n' +
  '1461246\n' +
  '1581005\n' +
  '1988273\n' +
  '1583875\n' +
  '478492\n' +
  '2429028\n' +
  '1613381\n' +
  '669722\n' +
  '1804234\n' +
  '2218897\n' +
  '2124055\n' +
  '1144933\n' +
  '2466204\n' +
  '1031723\n' +
  '1147079\n' +
  '2255338\n' +
  '865705\n' +
  '2386153\n' +
  '2147987\n' +
  '1968253\n' +
  '1977195\n' +
  '2512230\n' +
  '2398191\n' +
  '2461317\n' +
  '224789\n' +
  '2221101\n' +
  '1814325\n' +
  '2379774\n' +
  '267238\n' +
  '478616\n' +
  '2364658\n' +
  '940772\n' +
  '2108796\n' +
  '1597709\n' +
  '2060295\n' +
  '495475\n' +
  '2468194\n' +
  '2027480\n' +
  '1662047\n' +
  '2393697\n' +
  '1426228\n' +
  '2371926\n' +
  '1809883\n' +
  '70279\n' +
  '1079917\n' +
  '1628125\n' +
  '2443478\n' +
  '1903903\n' +
  '2181158\n' +
  '187787\n' +
  '2380690\n' +
  '1980591\n' +
  '1963938\n' +
  '1409948\n' +
  '2213022\n' +
  '2364706\n' +
  '809068\n' +
  '2020638\n' +
  '2418420\n' +
  '2128036\n' +
  '496959\n' +
  '445106\n' +
  '1258465\n' +
  '1154076\n' +
  '2508957\n' +
  '1444031\n' +
  '794315\n' +
  '389734\n' +
  '2434711\n' +
  '1137208\n' +
  '621546\n' +
  '1169745\n' +
  '530748\n' +
  '2098971\n' +
  '1955195\n' +
  '2033302\n' +
  '1469905\n' +
  '376352\n' +
  '920235\n' +
  '380046\n' +
  '1246648\n' +
  '545443\n' +
  '1434349\n' +
  '382612\n' +
  '1684780\n' +
  '2035861\n' +
  '1443322\n' +
  '1617434\n' +
  '1440319\n' +
  '2406769\n' +
  '598963\n' +
  '477856\n' +
  '676078\n' +
  '512905\n' +
  '1891199\n' +
  '600291\n' +
  '1914345\n' +
  '1869092\n' +
  '1462479\n' +
  '1743199\n' +
  '1378564\n' +
  '1243644\n' +
  '1465507\n' +
  '1285047\n' +
  '1848284\n' +
  '520991\n' +
  '1902956\n' +
  '915461\n' +
  '1260156\n' +
  '2355450\n' +
  '1785523\n' +
  '2531243\n' +
  '2388527\n' +
  '1856218\n' +
  '2427581\n' +
  '497372\n' +
  '2479708\n' +
  '1572608\n' +
  '456639\n' +
  '2106728\n' +
  '2130003\n' +
  '834724\n' +
  '1831826\n' +
  '2168544\n' +
  '389411\n' +
  '458239\n' +
  '1616725\n' +
  '1058756\n' +
  '1997305\n' +
  '2513791\n' +
  '2224901\n' +
  '1899493\n' +
  '1239059\n' +
  '346465\n' +
  '2440160\n' +
  '1709169\n' +
  '1831076\n' +
  '1018836\n' +
  '1485942\n' +
  '213325\n' +
  '2012724\n' +
  '251265\n' +
  '270505\n' +
  '1506124\n' +
  '1518854\n' +
  '1652792\n' +
  '1085172\n' +
  '285713\n' +
  '2464949\n' +
  '2277980\n' +
  '2503627\n' +
  '2249957\n' +
  '1812270\n' +
  '2249316\n' +
  '659565\n' +
  '230400\n' +
  '1602320\n' +
  '1321861\n' +
  '1730804\n' +
  '2356591\n' +
  '1129149\n' +
  '958132\n' +
  '2421394\n' +
  '2343589\n' +
  '2457528\n' +
  '2235548\n' +
  '1259805\n' +
  '2180493\n' +
  '1908176\n' +
  '2214464\n' +
  '2283616\n' +
  '1888237\n' +
  '1301903\n' +
  '2387706\n' +
  '2308226\n' +
  '1885569\n' +
  '1805032\n' +
  '2516562\n' +
  '2164651\n' +
  '534658\n' +
  '1264510\n' +
  '1026467\n' +
  '1716358\n' +
  '202075\n' +
  '1498089\n' +
  '264446\n' +
  '620181\n' +
  '634311\n' +
  '2117651\n' +
  '261725\n' +
  '2423074\n' +
  '1657379\n' +
  '2253784\n' +
  '618339\n' +
  '621757\n' +
  '2459177\n' +
  '2368008\n' +
  '1284263\n' +
  '1948888\n' +
  '582655\n' +
  '1987574\n' +
  '1892390\n' +
  '2254747\n' +
  '1111069\n' +
  '2213271\n' +
  '1832932\n' +
  '2265724\n' +
  '2168110\n' +
  '1969072\n' +
  '2253487\n' +
  '2139368\n' +
  '2531560\n' +
  '2517139\n' +
  '1941125\n' +
  '1724350\n' +
  '879419\n' +
  '1267680\n' +
  '982872\n' +
  '713946\n' +
  '390083\n' +
  '2353632\n' +
  '1627540\n' +
  '2109215\n' +
  '1450574\n' +
  '756512\n' +
  '2085440\n' +
  '505423\n' +
  '968338\n' +
  '782535\n' +
  '2438581\n' +
  '1705921\n' +
  '654622\n' +
  '2147037\n' +
  '887873\n' +
  '2370685\n' +
  '1805141\n' +
  '2404371\n' +
  '2069710\n' +
  '1145964\n' +
  '1548158\n' +
  '2231970\n' +
  '205251\n' +
  '330615\n' +
  '2454219\n' +
  '1924526\n' +
  '2383797\n' +
  '2293065\n' +
  '621819\n' +
  '219582\n' +
  '466273\n' +
  '1675406\n' +
  '904519\n' +
  '2102826\n' +
  '1879020\n' +
  '1427277\n' +
  '2144783\n' +
  '1643964\n' +
  '432405\n' +
  '214986\n' +
  '334349\n' +
  '2305858\n' +
  '2367640\n' +
  '2242482\n' +
  '2376610\n' +
  '984521\n' +
  '617888\n' +
  '1876256\n' +
  '640594\n' +
  '439121\n' +
  '2356602\n' +
  '725934\n' +
  '647293\n' +
  '2520787\n' +
  '521118\n' +
  '120331\n' +
  '2224957\n' +
  '1630606\n' +
  '856670\n' +
  '2157790\n' +
  '1828640\n' +
  '1702758\n' +
  '2223878\n' +
  '664885\n' +
  '702133\n' +
  '414419\n' +
  '1880147\n' +
  '2460122\n' +
  '2497525\n' +
  '2038867\n' +
  '1595473\n' +
  '829851\n' +
  '901872\n' +
  '1559324\n' +
  '1196414\n' +
  '1192883\n' +
  '465905\n' +
  '505112\n' +
  '1777663\n' +
  '219802\n' +
  '1293132\n' +
  '179307\n' +
  '219760\n' +
  '2513285\n' +
  '2130058\n' +
  '1852094\n' +
  '1510164\n' +
  '234233\n' +
  '241579\n' +
  '88219\n' +
  '2113109\n' +
  '612354\n' +
  '535583\n' +
  '805366\n' +
  '493154\n' +
  '2419547\n' +
  '517177\n' +
  '1716604\n' +
  '859979\n' +
  '421638\n' +
  '2486443\n' +
  '1940885\n' +
  '2341392\n' +
  '1732423\n' +
  '2242407\n' +
  '478248\n' +
  '1306377\n' +
  '1297708\n' +
  '1932619\n' +
  '2250671\n' +
  '1941213\n' +
  '266963\n' +
  '2506015\n' +
  '54477\n' +
  '684612\n' +
  '518240\n' +
  '1038586\n' +
  '2088751\n' +
  '2533799\n' +
  '1378460\n' +
  '1289095\n' +
  '1294913\n' +
  '119150\n' +
  '543614\n' +
  '732966\n' +
  '627533\n' +
  '1951161\n' +
  '2003285';
const id_array = id_string.split('\n');
const page = await browser.newPage();
await page.setDefaultNavigationTimeout(0);
await page.goto("https://www.nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/327709");
await page.waitForSelector('img#viewEmploymentHistoryButton');
//await page.goto(`https://www.nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/${10000 + count}`); 54182 54341 54571 737509  737566
while (count < id_array.length) {
  await page.goto(`https://www.nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/`+id_array[count]);

  try {
    await page.waitForTimeout(1000);

    await page.click('img#viewEmploymentHistoryButton');
    await page.waitForTimeout(1000);
    const len = await page.$$eval('div#entityDetail div.grid_950', els => els.length);

    if (len > 3) {
      try {
        const name = await page.$eval('div#entityDetail div.grid_950:nth-child(1) div.header p.individual', el => el.innerText);
        const infoTxt = await page.$eval('div#entityDetail div.grid_950:nth-child(1) table', el => el.innerText);
        const content = await page.$eval('div#entityDetail div.grid_950:nth-child(3):nth-child(3)', els => els.innerText);
        const startString = 'Financial Services';

        //get info
        const phoneString = 'Phone:';
        const faxString = 'Fax:';
        const pos1 = infoTxt.indexOf(phoneString) + phoneString.length;
        const pos2 = infoTxt.indexOf(faxString);

        const phoneNumber = infoTxt.substring(pos1, pos2).trim();
        const faxNumber = infoTxt.substring(pos2 + faxString.length).trim();

        const startOffset = startString.length;
        const startPos = content.indexOf(startString) + startOffset;
        const endPos = content.indexOf('\n', startPos);
        const nextEndPos = content.indexOf('\n', endPos + 10);
        const mainStr = content.substring(endPos+1, nextEndPos);


       // console.log(phoneNumber, faxNumber);
        const arrayStr = mainStr.split('\t');
        if (arrayStr.length === 9) {
          if (arrayStr[1].trim() === 'Present') {
            //console.log(arrayStr[1].trim(), arrayStr[3].trim()); PA, OR, CO, NC.
            if (arrayStr[3].toLowerCase().indexOf('broker') > -1  || arrayStr[3].toLowerCase().indexOf('real estate') > -1 || arrayStr[3].toLowerCase().indexOf('realtor') > -1 && arrayStr[3].toLowerCase().indexOf('ort') < 0) {
              if (arrayStr[5].trim() === 'FL' || arrayStr[5].trim() === 'TX' || arrayStr[5].trim() === 'PA' || arrayStr[5].trim() === 'OR' || arrayStr[5].trim() === 'CO' || arrayStr[5].trim() === 'NC') {
                data.push({
                  id: id_array[count],
                  name: name,
                  position: arrayStr[3],
                  phone: phoneNumber,
                  fax: faxNumber,
                  state: arrayStr[5]
                });
                console.log('$$$$$  ', data.length, id_array[count], '###count ', count);
              }
            }
          }
        }
      }
      catch (e) {}
    }
  } catch (e) {
    await page.waitForTimeout(5000);
    if (count > 0) {
      try {
        await page.$eval('input#searchText', el => el);
      } catch (e) {
        count -= 2;
      }
    }
  }
  finally {
    count += 1;
    console.log('!======== ', count);
  }
}
console.log('@@@@@@final count value', data);


//console.log('count', data);

await browser.close();
saveAsCSV(data);



