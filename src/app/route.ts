import { NextRequest, NextResponse } from 'next/server';
import { getInterfaceConfig } from '@/lib/update-manager';

/**
 * 生成HTML界面
 */
function generateHtml(b: string, baseUrl: string, announcement: string): string {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>装歌API</title>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport">
    <meta content="yes" name="apple-mobile-web-app-capable">
    <meta content="black" name="apple-mobile-web-app-status-bar-style">
    <meta name="format-detection" content="telephone=no">
    <meta content="false" name="twcClient" id="twcClient">
    <meta name="aplus-touch" content="1">
   
    <style>
        body,html{width:100%;height:100%}
        *{margin:0;padding:0}
        body{background-color:#fff}
        #browser img{width:50px;}
        #browser{margin: 0px 10px;text-align:center;}
        #contens{
            font-weight: bold;
            color: #2466f4;
            margin:-285px 0px 10px;
            text-align:center;
            font-size:20px;
            margin-bottom: 50px;
        }
        .top-bar-guidance{font-size:15px;color:#fff;height:70%;line-height:1.8;padding-left:20px;padding-top:20px;background:url(https://ncstatic.clewm.net/rsrc/2025/0912/20/1131f18c0aef442a81e2845666b6640b.png) center top/contain no-repeat}
        .app-download-tip{margin:0 auto;width:290px;text-align:center;font-size:15px;color:#2466f4;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAcAQMAAACak0ePAAAABlBMVEUAAAAdYfh+GakkAAAAkAAAAAXRSTlMAQObYZgAAAA5JREFUCNdjwA8acEkAAAy4AIE4hQq/AAAAAElFTkSuQmCC) left center/auto 15px repeat-x}
        .app-download-tip .guidance-desc{background-color:#fff;padding:0 5px}
        .app-download-btn{display:block;height:40px;line-height:40px;margin:18px auto 0 auto;text-align:center;font-size:18px;color:#2466f4;border-radius:20px;border:.5px #2466f4 solid;text-decoration:none}
        
        /* 提示框样式 */
        .toast {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 12px 20px;
            border-radius: 8px;
            background-color: rgba(46, 125, 50, 0.9);
            color: white;
            font-size: 16px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
            display: flex;
            align-items: center;
        }
        .toast.show { opacity: 1; }
        .toast.blue { background-color: rgba(33, 150, 243, 0.9); }
    </style>
</head>
<body>

<div class="top-bar-guidance"></div>
<div id="contens">
    <p>1.${b}线路专用接口</p>
    <p><br/></p>
    <p>2.长期维护永远免费切勿贩卖</p>
</div>
<div class="app-download-tip">
    <span class="guidance-desc">装逼专属接口，赶快来体验吧</span>
</div>
<div class="app-download-tip">
    <span class="guidance-desc">${baseUrl}</span>
</div>

<p><br/></p>
<p><br/></p>
<button class="app-download-btn" onclick="copy1()" style="text-align: center; width: auto; padding: 0 20px;">
    点此复制${b}接口
</button>

<p><br/></p>
<div class="app-download-tip">
    <span class="guidance-desc">要分清单仓食用</span>
</div>

<p><br/></p>

<button class="app-download-btn" onclick="openInputWindow()" style="text-align: center; width: auto; padding: 0 20px;">
    ${b}我要装B
</button>

<script>
var baseUrl = "${baseUrl}";
var defaultB = "${b}";

function showToast(message, isBlue) {
    var toast = document.createElement("div");
    toast.className = "toast" + (isBlue ? " blue" : "");
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(function() { toast.classList.add("show"); }, 10);
    setTimeout(function() {
        toast.classList.remove("show");
        setTimeout(function() { document.body.removeChild(toast); }, 300);
    }, 3000);
}

function copy1() {
    var currentB = window.aa1 || defaultB;
    var customContent1 = baseUrl;
    
    if (customContent1.indexOf("?") === -1) {
        customContent1 += "?b=" + currentB;
    } else if (customContent1.indexOf("b=") === -1) {
        customContent1 += "&b=" + currentB;
    } else {
        customContent1 = customContent1.replace(/b=[^&]*/, "b=" + currentB);
    }
    
    var tempInput = document.createElement("input");
    tempInput.value = customContent1;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    showToast("已成功复制" + currentB + "接口配置食用");
}

function openInputWindow() {
    var userInput = prompt("请输入内容名字：", defaultB);
    if (userInput !== null && userInput.trim() !== "") {
        window.aa1 = userInput;
        document.querySelector("#contens p:first-child").innerHTML = "1." + userInput + "线路专用域名接口";
        document.querySelectorAll(".app-download-btn")[0].innerHTML = "点此复制" + userInput + "接口";
        document.querySelectorAll(".app-download-btn")[1].innerHTML = userInput + "装B成功";
        showToast("已更新名子为：" + userInput, true);
    } else if (userInput !== null) {
        showToast("输入内容不能为空", true);
    }
}
</script>
</body>
</html>`;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const b = searchParams.get('b') || '装歌';
    const announcement = process.env.ANNOUNCEMENT || '失效等候更新或者在线更新本地包防失效';
    
    // 获取请求URL对象
    const requestUrl = new URL(request.url);
    
    // 检查是否手动指定了BASE_URL（生产环境推荐）
    let baseUrl: string;
    if (process.env.BASE_URL && process.env.BASE_URL.trim() !== '') {
      baseUrl = process.env.BASE_URL.trim();
      console.log('使用环境变量BASE_URL:', baseUrl);
    } else {
      // 从请求URL自动获取
      const host = requestUrl.host;
      const protocol = requestUrl.protocol.replace(':', '');
      baseUrl = `${protocol}://${host}`;
      console.log('自动检测baseUrl:', baseUrl);
    }
    
    const pathname = request.nextUrl.pathname || '/';
    const search = request.nextUrl.search || '';
    
    // siteurl: 完整请求URL（协议+主机+路径+查询参数）
    const siteurl = `${baseUrl}${pathname}${search}`;
    
    // 调试日志
    console.log('=== URL Debug Info ===');
    console.log('request.url:', request.url);
    console.log('baseUrl:', baseUrl);
    console.log('siteurl:', siteurl);
    console.log('===================');
    
    // 检查是否是浏览器访问（通过User-Agent）
    const userAgent = request.headers.get('user-agent') || '';
    const isBrowser = /(Windows|Macintosh|Android|Mobile|QQ|MicroMessenger)/i.test(userAgent);

    if (isBrowser) {
      // 返回HTML界面（使用baseUrl，只显示协议+主机）
      const html = generateHtml(b, baseUrl, announcement);
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // 读取并处理接口配置
    const config = await getInterfaceConfig(baseUrl, b, announcement);
    
    if (config) {
      return new NextResponse(config, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }

    return new NextResponse('配置文件不存在', { status: 404 });
  } catch (error) {
    console.error('Clone API错误:', error);
    return new NextResponse('服务器错误', { status: 500 });
  }
}
