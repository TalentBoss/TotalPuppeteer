import puppeteer from "puppeteer";
import WebSocket from "ws";


const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
});

// Open a new page
const page = await browser.newPage();

await page.setDefaultNavigationTimeout(0)
await page.goto("https://www.solverde.pt/casino");
await page.waitForTimeout(6000);
await page.click('button.sv-header-login__button');
await page.waitForTimeout(6000);
const userNameElement = await page.$('div.form__fieldset div.field_name_username div.field__control input.fn-user-name');
// Input a value into the input element
await userNameElement.type('rafboard');
await page.waitForTimeout(2000);
const passwordElement = await page.$('div.field_name_password div.field__control input.fn-input-type-password');
await passwordElement.type('Test1234!');
await page.waitForTimeout(2000);
//await page.waitForTimeout(6000);
await page.click('div.login-form__actions button.fn-login-btn');
await page.waitForTimeout(10000);


await page.goto('https://www.solverde.pt/online-game/absolutely-mammoth-powerplay-jackpot');
await page.waitForTimeout(10000);


await page.setRequestInterception(true);

await page.evaluate(() => new WebSocket('wss://openapi.framegas.com/socket.io/1/websocket/'));

const wsPrototypeHandle = await page.evaluateHandle(
  () => WebSocket.prototype
);

const wsInstances = await page.queryObjects(wsPrototypeHandle);

const wsUrls = await page.evaluate(
  (e) => e.map((e) => e['url']), // <-- simply access the object here
  wsInstances
);

console.log(wsUrls);

page.setRequestInterception(true).then(r => console.log("@@@star ", r));

// Listen for WebSocket upgrade requests
page.on('request', (request) => {
  if (request.url().startsWith('ws://') || request.url().startsWith('wss://')) {
    // Allow the WebSocket request to proceed
    request.continue();
  } else {
    // Block all other requests
    request.abort();
  }
});


/*
for (const item of wsUrls) {
  const ws = new WebSocket(item);
  ws.on('open', async () => {
    console.log(`${item} is opened!`);
  });

  ws.on('message', function incoming(data) {
    console.log("jdsfjsojdfwejfjwoeijfiowejf  ", data);
    if (data === "1::") {
      console.log(`received!\n${data}`);
    }
  });
}*/


/*const ws = new WebSocket(item, null, {
  headers: {
      "Cookie":"_dy_ses_load_seq=96114%3A1685749891692;_dy_csc_ses=t;__zlcmid=1GAlrmgBTcq5Q4I;_gcl_au=1.1.2094012504.168508932;_fbp=fb.1.1685708937401.271794176;_ga=GA1.1.752693723.1685708936;_ga_R5Y2PGDH4B=GS1.1.1685753046.6.1.1685753071.35.0.0;pas[casinosolverde.pt][real][isOnline]=1;ai_user=5Gh/LuWV480wnAvXgvsyrS|2023-06-02T12:28:55.681Z;cookie_layer=1;ai_sessionportal=WbX3Dk52jVjhZiFk/Rhmmg|1685749588562|1685753933253;",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    },
  origin: "https://www.solverde.pt"
  }
);*/


/*async function getWebSocketData(wsUrls) {
  for (const item of wsUrls) {
    await page.goto(item);
// Intercept WebSocket messages
    page.on('websocket', ws => {
      ws.on('message', message => {
        console.log(`Received message: ${message}`);
      });
    });
  }
}*/

async function run() {
 // await page.goto('http://powerline.io');
  const cdp = await page.target().createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Page.enable');

  const printResponse = response => console.log('response: ', response);

  cdp.on('Network.webSocketFrameReceived', printResponse); // Fired when WebSocket message is received.
  cdp.on('Network.webSocketFrameSent', printResponse); // Fired when WebSocket message is sent.
}


await browser.close();
