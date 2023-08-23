---
title: QQ、微信、微博、空间等分享链接接入
date: 2021-03-20
category:
  - Web
tag:
  - 分享链接
---

<!-- more -->

## 一、HTMl代码

### 1、隐藏标签用于获取信息
```html
<img style="display:none" id="coverImage" src="@item.Art_HeadImg" />
<input type="hidden" id="description" value="@item.Art_ShortContent">
<div id="qrcode" style="display:none;"></div>
```
### 2、放置分享按钮，图片自行百度吧，就不放了
```html
<div class="bdsharebuttonbox share">
    <ul>
        <li><img src="~/Content/image/qqShare.png" id="QQSHare" /></li>
        <li><img src="~/Content/image/zoneShare.png" id="ZoneShare" /></li>
        <li><img src="~/Content/image/weiboShare.png" id="WeiboShare" /></li>
        <li><img src="~/Content/image/weiChatShare.png" id="WeiChatShare" /></li>
    </ul>
</div>
```

## 二、JS代码
### 1、JS代码
```js
<script type="text/javascript">
    var qrcode = new QRCode("qrcode", {
        text: location.href,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });


    //QQ分享
    $("#QQSHare").click(function () {
        var initUrl = "http://connect.qq.com/widget/shareqq/index.html?url=";
        //浏览器网址
        var browser = encodeURIComponent(location.href);
        //console.log(location);
        //文章标题
        var title = $(".r-title").text();
        //分享图片地址
        var coverImage = location.origin + $("#coverImage").attr("src");
        //描述
        var description = $("#description").val();
        initUrl = initUrl + browser + "&sharesource=qzone&title=" + title + "&pics=" + coverImage + "&summary=" + description;// + "&desc=" + description;
        //console.log(coverImage);
        window.open(initUrl);
        //window.open("http://connect.qq.com/widget/shareqq/index.html?url=https://www.dennisdong.top/Article/GetDetail?articleId=30622f5480ad49f78f1556dae8cbc020&sharesource=qzone&title=你的分享标题&pics=你的分享图片地址&summary=你的分享描述&desc=你的分享简述");
    });

    //QQ空间分享,本地测试链接为localhost会出现标题和内容undefined
    $("#ZoneShare").click(function () {
        var initUrl = "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=";
        //浏览器网址
        var browser = encodeURIComponent(location.href);
        //文章标题
        var title = $(".r-title").text();
        //分享图片地址
        var coverImage = location.origin + $("#coverImage").attr("src");
        //描述
        var description = $("#description").val();
        initUrl = initUrl + browser + "&title=" + title + "&pics=" + coverImage + "&summary=" + description;
        //console.log(initUrl);
        window.open(initUrl);
        //https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=http://zixuephp.net/article-309.html?sharesource=qzone&title=一键分享到QQ空间、QQ好友、新浪微博、微信代码&pics=http://zixuephp.net/uploads/image/20170810/1502335815192079.png&summary=通过各自平台的开发接口，进行参数指定，进行一键分享javascript代码功能
    });

    //新浪微博
    $("#WeiboShare").click(function () {
        var initUrl = "http://service.weibo.com/share/share.php?url=";
        //浏览器网址
        var browser = encodeURIComponent(location.href);
        //文章标题
        var title = $(".r-title").text();
        //分享图片地址
        var coverImage = location.origin + $("#coverImage").attr("src");
        //描述
        var description = $("#description").val();
        initUrl = initUrl + browser + "&sharesource=weibo&title=" + title + "&pics=" + coverImage + "&appkey=1343713053";
        //console.log(initUrl);
        window.open(initUrl);
        //http://service.weibo.com/share/share.php?url=你的分享网址&sharesource=weibo&title=你的分享标题&pic=你的分享图片&appkey=你的key，需要在新浪微博开放平台中申请
    });

    //微信分享
    $("#WeiChatShare").click(function () {
        layer.open({
            type: 1,
            title: false,
            area: ['200px', '200px'],
            shadeClose: true,
            closeBtn: false,
            content: $('#qrcode')
        });
    });

</script>
```
**PS：生成二维码需要引入qrcode.min.js文件**

```js
<script src=@Url.Content("~/Content/js/plugins/qrcode.min.js?v=" + new Random().NextDouble())></script>
```