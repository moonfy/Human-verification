const chromeLauncher = require('chrome-launcher');
const crawler_utils = require('../../utils/crawler_utils');
const puppeteer = require('puppeteer');
async function smart() {
    const chrome = await chromeLauncher.launch({});
    setTimeout(async () => {
        await process.kill(chrome.pid)
    }, 30 * 1000);
    const url = `http://127.0.0.1:${chrome.port}/json/version`;

    const body = await crawler_utils.requestJob(url);
    const webSocketDebuggerUrl = body.webSocketDebuggerUrl;
    console.log(webSocketDebuggerUrl);
    console.log(chrome.pid);
    const browser = await puppeteer.connect({browserWSEndpoint: webSocketDebuggerUrl});
    const page = await browser.newPage();
    await page.goto("http://www.yczwfw.gov.cn/web2/src/index/loginForThd.html");
    await page.waitFor(5 * 1000);
    await page.click(`#rectBottom`);


}

smart();
