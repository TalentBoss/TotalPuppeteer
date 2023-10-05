import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';

const saveAsCSV = (csvData) => {
    const csv = parse(csvData)
    writeFileSync('result.csv', csv);
}

const getQuotes = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    // Open a new page
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(0)
    await page.goto("https://merchants.egyptianlinens.com/collections/sheet-sets");

    let results = [];
    let urls = [];
    let lastPageNumber = 1;

    urls = await extractedEvaluateCall(page);

    /*for (const url of urls) {
        await page.goto(url.link);
        await page.waitForTimeout(1000)
        results = results.concat(await getAllInformation(page));
    }*/
    console.log(urls);

    // Close the browser
    await browser.close();

    // Save data into .csv file
    // saveAsCSV(results);
};

async function extractedEvaluateCall(page) {
    await page.waitForTimeout(50000);
    return await page.evaluate(() => {
        const items = document.querySelectorAll("div.product-item product-item--vertical  1/3--tablet 1/4--lap-and-up");

        return Array.from(items).map((item) => {
            const url = item.querySelector("a[href]").href;
            return {url};
        });
    });
}

async function getAllInformation(page) {
    await page.waitForSelector('div#dp-container')

    let title = await page.$eval("div#titleSection h1#title span#productTitle", el => el.innerText)

    let caseCount = await page.$$eval("div#tp-inline-twister-dim-values-container ul li", els => els.length)
    let small_price = ''
    let medium_price = ''
    let large_price = ''
    let xlarge_price = ''
    for (let i = 1; i < caseCount; i++) {
        let property = ''
        try {
            property = await page.$eval("div#tp-inline-twister-dim-values-container ul li:nth-child("+(i+1)+") span span span span div.swatch-title-text-container span", el => el.innerText)
        } catch (e) {

        }

        if (property.includes('Small')) {
            try {
                small_price = await page.$eval("div#tp-inline-twister-dim-values-container ul li:nth-child("+(i+1)+") span span span span div.slots-padding div span span:nth-child(1)", el => el.innerText)
            } catch (e) {

            }
        } else if (property.includes('Medium')) {
            try {
                medium_price = await page.$eval("div#tp-inline-twister-dim-values-container ul li:nth-child("+(i+1)+") span span span span div.slots-padding div span span:nth-child(1)", el => el.innerText)
            } catch (e) {

            }
        } else if (property.includes('X-Large')) {
            try {
                large_price = await page.$eval("div#tp-inline-twister-dim-values-container ul li:nth-child("+(i+1)+") span span span span div.slots-padding div span span:nth-child(1)", el => el.innerText)
            } catch (e) {

            }
        } else if (property.includes('Large')) {
            try {
                xlarge_price = await page.$eval("div#tp-inline-twister-dim-values-container ul li:nth-child("+(i+1)+") span span span span div.slots-padding div span span:nth-child(1)", el => el.innerText)
            } catch (e) {

            }
        }
    }

    let material = ''
    try {
        material = await  page.$eval("div#dp-container tr.po-material span.po-break-word", element=>element.innerText);
    } catch (error) {

    }

    let brand = ''
    try {
        brand = await  page.$eval("div#dp-container tr.po-brand span.po-break-word", element=>element.innerText);
    } catch (error) {

    }

    let size = ''
    try {
        size = await  page.$eval("div#dp-container tr.po-size span.po-break-word", element=>element.innerText);
    } catch (error) {

    }

    let color = ''
    try {
        color = await  page.$eval("div#dp-container tr.po-color span.po-break-word", element=>element.innerText);
    } catch (error) {

    }

    let special_feature = ''
    try {
        special_feature = await  page.$eval("div#dp-container tr.po-special_feature span.po-break-word", element=>element.innerText);
    } catch (error) {

    }

    let unit_count = ''
    try {
        unit_count = await  page.$eval("div#dp-container tr.po-unit_count span.po-break-word", element=>element.innerText);
    } catch (error) {

    }

    let recommended = ''
    try {
        recommended = await  page.$eval("div#dp-container tr.po-recommended_uses_for_product span.po-break-word", element=>element.innerText);
    } catch (error) {

    }

    let resuability = ''
    try {
        resuability = await  page.$eval("div#dp-container tr.po-reusability span.po-break-word", element=>element.innerText);
    } catch (error) {

    }

    let age_range = ''
    try {
        age_range = await page.$eval("div#dp-container tr.po-age_range_description span.po-break-word", element=>element.innerText);
    } catch (error) {

    }

    let material_type_free = ''
    try {
        material_type_free = await page.$eval("div#dp-container tr.po-material_type_free span.po-break-word", element=>element.innerText);
    } catch (e) {

    }

    let detailCount = await page.$$eval("#detailBullets_feature_div > ul > li", el => el.length);
    let dimensions = ''
    let model = ''
    let manufacture = ''
    let asin = ''
    let department = ''

    for (let i = 0; i < detailCount; i++) {
        let property = await page.$eval("#detailBullets_feature_div > ul > li:nth-child("+(i+1)+") > span > span:nth-child(1)", el => el.innerText);

        if (property.includes('Dimensions')) {
            try {
                dimensions = await page.$eval("#detailBullets_feature_div > ul > li:nth-child("+(i+1)+") > span > span:nth-child(2)", el => el.innerText);
            } catch (e) {

            }
        } else if (property.includes('model')) {
            try {
                model = await page.$eval("#detailBullets_feature_div > ul > li:nth-child("+(i+1)+") > span > span:nth-child(2)", el => el.innerText);
            } catch (e) {

            }
        } else if (property.includes('Department')) {
            try {
                department = await page.$eval("#detailBullets_feature_div > ul > li:nth-child("+(i+1)+") > span > span:nth-child(2)", el => el.innerText);
            } catch (e) {

            }
        } else if (property.includes('Manufacturer')) {
            try {
                manufacture = await page.$eval("#detailBullets_feature_div > ul > li:nth-child("+(i+1)+") > span > span:nth-child(2)", el => el.innerText);
            } catch (e) {

            }
        } else if (property.includes('asin')) {
            try {
                asin = await page.$eval("#detailBullets_feature_div > ul > li:nth-child("+(i+1)+") > span > span:nth-child(2)", el => el.innerText);
            } catch (e) {

            }
        }
    }

    return { title, small_price, medium_price, large_price, xlarge_price, material, brand, size, color, special_feature, unit_count, recommended, resuability, age_range, material_type_free, dimensions, model, manufacture, asin, department };
}

// Start the scraping
getQuotes();