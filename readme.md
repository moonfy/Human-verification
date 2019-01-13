
### tips!

阿里云人机验证

以上干货仅仅只是用来技术交流，请勿在其他非法途径使用

#### 阿里云人机验证

基本原理:通过chrome-launcher启动本地chrome(最好选择71的最新chrome版本,否则可能会遇到深坑)，

文件位置：/lib/service

1.无痕验证

该验证只相当于其他验证的一个入口，用户真正会面对的是其他四种验证，所以后面我会对应用该验证的网站做一些详细说明

2.智能验证:

某社保网站
http://61.136.223.44/web2/src/index/login.html

```
//启动本地chrome
    const chrome = await chromeLauncher.launch({});
    setTimeout(async () => {
        await process.kill(chrome.pid)
    }, 30 * 1000);
    const url = `http://127.0.0.1:${chrome.port}/json/version`;
//请求获取调试接口
    const body = await crawler_utils.requestJob(url);
    const webSocketDebuggerUrl = body.webSocketDebuggerUrl;
    console.log(webSocketDebuggerUrl);
    console.log(chrome.pid);
    //使用puppeteer连接本地chrome
    const browser = await puppeteer.connect({browserWSEndpoint: webSocketDebuggerUrl});
    const page = await browser.newPage();
    await page.goto("http://www.yczwfw.gov.cn/web2/src/index/loginForThd.html");
    await page.waitFor(5 * 1000);
    //点击智能验证
    await page.click(`#rectBottom`);
```

3.滑动验证

某购物网站

```
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
    await page.waitFor(5 * 1000);
    //点击跳转到登录页面
    await page.click(`#J_SiteNavLogin > div.site-nav-menu-hd > div.site-nav-sign > a.h`);
   await page.waitFor(2*1000)
   //切换到账号密码输入部分
    await page.click(`#J_Quick2Static`);
    //输入账号密码
    await page.type(`#TPL_username_1`,account,{delay:100});
    await page.type(`#TPL_password_1`,password,{delay:100});
    //对于阿里云的滑动验证，风控那边返回给你的滑块的#id会在3个里面随机返回给你一个
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
    //获取鼠标
    const mouse = await page.mouse;
    await mouse.down();
    await mouse.move(750, 0, {steps: 100});
    await mouse.up();
    await page.waitFor(5 * 1000);
    //点击登录
    await page.click(`#J_SubmitStatic`);
    await page.waitFor(5 * 1000);
}

sliding(`moonfy`,`moonfy`);

```

4.刮刮卡验证


```
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
    await mouse.down();
    //在刮刮卡个人测试中，我们需要找到刮刮卡图片四个点的坐标，可以先启动testlaunch.js，另一个puppeteer的连接程序，然后通过page.hover(`#nc_1_canvas`)找到刮刮卡的中点，通过不断的操作mouse，查看刮刮卡上鼠标移动的轨迹，可以轻松找到4点点
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

```

5.投篮验证

周日的时候好好看了一下，发现这个主要是接SDK,所以没找到相关的网站来写Demo来给大家展示，所以今天就主要给大家说说解决思路：解决投篮验证，就必须将操作篮球将其移动到篮筐，因此，我们需要知道的是篮球和篮筐的坐标点。篮球由于是可以移动的，因此篮球的初始坐标点肯定是可以从服务端拿到的，至于蓝框的坐标点，

![image](http://docs-aliyun.cn-hangzhou.oss.aliyun-inc.com/assets/pic/45266/cn_zh/1478675449183/Android&iOS.png)