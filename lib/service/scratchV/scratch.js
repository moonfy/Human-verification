const chromeLauncher = require('chrome-launcher');
const crawler_utils = require('../../utils/crawler_utils');
const puppeteer = require('puppeteer');
async function scratch(account) {
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
    const pages = await browser.pages();
    const page = pages[0];
    await page.goto("https://passport.aliyun.com/ac/password_find.htm?spm=a212t0.3047821.0.0.a95e79f4BZSwz0&lang=zh_CN&appName=aliyun&fromSite=6&call_back_url=##returnUrl##");
    await page.waitFor(5 * 1000);
    await page.type(`#J-accName`,account,{delay:100});
    await page.hover(`#nc_1_canvas`);
    await page.waitFor( 1000);
    const mouse = await page.mouse;
    console.log("begin");
    await mouse.down();
    //610 380  右上
    //610 480  右下
    //305,385  左上
    // 300 480 左下
    for(let y=380;y<481;y+=20){
        await mouse.move(300,y,{steps: 100});
        await mouse.move(610,y,{steps: 100});
    }
    await mouse.up();
    await page.waitFor(2*1000);
    await page.click(`#submitBtn`);
}
scratch("12345678");
