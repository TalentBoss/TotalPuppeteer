import puppeteer from "puppeteer";
import WebSocket from "ws";


const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
});

// Open a new page
const page = await browser.newPage();

await page.setDefaultNavigationTimeout(0)
await page.goto("https://www.workana.com/login");
await page.waitForTimeout(6000);
const userEmailElement = await page.$('input[type=email]');
// Input a value into the input element
await userEmailElement.type('YaroslavyZaitsev@outlook.com');
await page.waitForTimeout(2000);
const passwordElement = await page.$('input[type=password]');
await passwordElement.type('neverbeyou2023');
await page.waitForTimeout(2000);
//await page.waitForTimeout(6000);
await page.click('div.wk-submit-block button');
await page.waitForTimeout(2000);


await page.goto('https://www.workana.com/jobs?language=en');
await page.waitForTimeout(2000);


await page.evaluate(() => new WebSocket('\n' +
  'wss://ws-mt1.pusher.com/app/5d14500e05a938842a18?protocol=7&client=js&version=7.0.6&flash=false'));

const wsPrototypeHandle = await page.evaluateHandle(
  () => WebSocket.prototype
);

const wsInstances = await page.queryObjects(wsPrototypeHandle);

const wsUrls = await page.evaluate(
  (e) => e.map((e) => e['url']), // <-- simply access the object here
  wsInstances
);

console.log(wsUrls);

wsUrls.forEach(item => {
  const ws = new WebSocket(item);
  ws.on('open', () => {
    console.log(`${item} is opened!`);
  });

  ws.on('message', function incoming(data) {
    console.log(`received!\n${data}`);
  })
})



await browser.close();
