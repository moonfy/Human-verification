const chromeLauncher = require('chrome-launcher');
const crawler_utils = require('../../utils/crawler_utils');

async function test() {

    let  chrome = await chromeLauncher.launch({
        });
        console.log(`Chrome debugging port running on ${chrome.port}`);



    let url = `http://127.0.0.1:${chrome.port}/json/version`;
    try {
        let body = await crawler_utils.requestJob(url);
        let  webSocketDebuggerUrl  = body.webSocketDebuggerUrl;
        console.log(webSocketDebuggerUrl);
    }
    catch (e) {
        console.log("requesterror")
    }
}

test();
