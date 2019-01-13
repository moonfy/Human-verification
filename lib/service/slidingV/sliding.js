const chromeLauncher = require('chrome-launcher');
const crawler_utils = require('../../utils/crawler_utils');
const puppeteer = require('puppeteer');
async function sliding(account,password) {
    const chrome = await chromeLauncher.launch({});
    setTimeout(async () => {
        await process.kill(chrome.pid)
    }, 60 * 1000);
    const url = `http://127.0.0.1:${chrome.port}/json/version`;

    const body = await crawler_utils.requestJob(url);
    const webSocketDebuggerUrl = body.webSocketDebuggerUrl;
    console.log(webSocketDebuggerUrl);
    console.log(chrome.pid);
    const browser = await puppeteer.connect({browserWSEndpoint: webSocketDebuggerUrl});
    const page = await browser.newPage();
    await page.goto("https://www.taobao.com/");

    await page.waitFor(5*1000)
    await page.click(`#J_SiteNavLogin > div.site-nav-menu-hd > div.site-nav-sign > a.h`);
   await page.waitFor(5*1000)
    await page.click(`#J_Quick2Static`);
    await page.type(`#TPL_username_1`,account,{delay:100});
    await page.type(`#TPL_password_1`,password,{delay:100});
    try {
        await page.hover(`#nc_3_n1z`).catch(e1 => {
            throw e1;
        });
    } catch (e) {
        try {
            await page.hover(`#nc_2_n1z`).catch(e1 => {
                throw e1;
            });
        } catch (err) {
            await page.hover(`#nc_1_n1z`).catch(e1 => {
                throw e1;
            })
        }
    }
    const mouse = await page.mouse;
    await mouse.down();
    await mouse.move(750, 0, {steps: 100});
    await mouse.up();
    await page.waitFor(5 * 1000);
    await page.click(`#J_SubmitStatic`);
    await page.waitFor(5 * 1000);
}

sliding(`moonfy`,`moonfy`);
