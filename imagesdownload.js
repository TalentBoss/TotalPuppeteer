import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import https from 'https';

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null// Replace with your actual proxy server and port
});

// Open a new page
const page = await browser.newPage();

await page.setDefaultNavigationTimeout(0);
await page.goto("https://www.w3schools.com/cssref/pr_grid-auto-rows.php");
await page.waitForTimeout(10000);


const images = await page.evaluate(() => Array.from(document.images, e => e.src));

for (let i = 0; i < images.length; i++) {
  let result = await download(images[i], `images/image-${i}.png`);
  if (result === true) {
    console.log('Success:', images[i], 'has been downloaded successfully.');
  } else {
    console.log('Error:', images[i], 'was not downloaded.');
  }
}

/*page.on('response', async response => {
  const url = response.url();
  if (response.request().resourceType() === 'image') {
    response.buffer().then(file => {
      const fileName = url.split('/').pop();
      const filePath = path.resolve(__dirname, "1.png");
      const writeStream = fs.createWriteStream(filePath);
      writeStream.write(file);
    });
  }
});*/



async function download (url, destination) {
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    https.get(url, response => {
      response.pipe(file);

      file.on('finish', () => {
        file.close(resolve(true));
      });
    }).on('error', error => {
      fs.unlink(destination);

      reject(error.message);
    });
  });
}

await browser.close();