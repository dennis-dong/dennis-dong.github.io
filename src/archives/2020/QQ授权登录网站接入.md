---
title: QQ授权登录网站接入
description: QQ授权登录网站接入
date: 2020-08-15
category:
  - Web
  - Net
tag:
  - QQ登录
---

<!-- more -->

## 一、你得先去[QQ授权登录官网](https://connect.qq.com/manage.html#/)申请开发者（登录之后右上角头像点击一下填写申请信息）

## 二、开发者审核通过之后创建应用
### PS：注意事项
1、网站名称必须和后面绑定的域名备案名称完全一致！！！！不然审核不通过，提示与备案信息不一致
2、网站首页必须放置QQ登录的按钮，然后点击之后要跳转到授权页面，即使没有审核通过也要有反应，哪怕是错误的页面，例如下图即可
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20200824140414152-989469190.png)

## 三、网站应用审核通过之后就可以根据PAI文档开发授权登录啦
### 1、生成授权连接
### 2、用户授权登录后根据回调的code获取AccessToken
### 3、再根据AccessToken获取OpenId
### 4、再根据AccessToken和OpenId获取用户信息，具体返回的信息可参考API文档

## 四、代码截图
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20200824140508359-1982530450.png)

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20200824140515533-602768217.png)

## 五、代码片段

### QQLoginHelper 帮助类

```csharp
public class QQLoginHelper
    {
        public static string appId = ""; //申请QQ登录成功后，分配给应用的appid。
        public static string appKey = ""; //申请QQ登录成功后，分配给应用的appkey。
        public static string redirect_uri = ""; //成功授权后的回调地址，必须是注册appid时填写的主域名下的地址。

        /// <summary>
        /// 生成授权连接
        /// </summary>
        /// <param name="state"></param>
        /// <param name="deviceType"></param>
        /// <returns></returns>
        public static string CreateAuthorizeUrl(string state, string deviceType)
        {
            string url = string.Format("{0}?client_id={1}&response_type=code&redirect_uri={2}&state={3}&display={4}&scope=scope", "https://graph.qq.com/oauth2.0/authorize", appId, redirect_uri, state, deviceType);
            return url;
        }

        /// <summary>
        /// 根据回调获取AccessToken
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        public static string GetAccessToken(string code)
        {
            string url = string.Format("https://graph.qq.com/oauth2.0/token?grant_type={0}&client_id={1}&client_secret={2}&code={3}&redirect_uri={4}", "authorization_code", appId, appKey, code, redirect_uri);
            string result = HttpMethodHelper.HttpGet(url);
            string AccessToken = CutString(result, "access_token=", "&expires_in=");
            string ExpiresIn = CutString(result, "&expires_in=", "&refresh_token=");
            string RefreshToken = result.Split(new string[] { "&refresh_token=" }, StringSplitOptions.None)[1];
            return AccessToken;
        }

        /// <summary>
        /// 根据回调获取OpenId
        /// </summary>
        /// <param name="access_token"></param>
        /// <returns></returns>
        public static string GetOpenId(string access_token)
        {
            string url = string.Format("https://graph.qq.com/oauth2.0/me?access_token={0}", access_token);
            string result = HttpMethodHelper.HttpGet(url);
            string client_id = CutString(result, @"client_id"":""", @""",");
            string openid = CutString(result, @"openid"":""", @"""}");
            return openid;
        }

        /// <summary>
        /// 获取用户信息转换为实体
        /// </summary>
        /// <param name="access_token"></param>
        /// <param name="openid"></param>
        /// <returns></returns>
        public static QQUserInfo GetQQUserInfo(string access_token, string openid)
        {
            string url = string.Format("https://graph.qq.com/user/get_user_info?access_token={0}&oauth_consumer_key={1}&openid={2}", access_token, appId, openid);
            string result = HttpMethodHelper.HttpGet(url, Encoding.UTF8);
            QQUserInfo qqUserInfo = JsonConvert.DeserializeObject<QQUserInfo>(result);
            return qqUserInfo;
        }

        /// <summary>
        /// 获取用户信息JSON字符串
        /// </summary>
        /// <param name="access_token"></param>
        /// <param name="openid"></param>
        /// <returns></returns>
        public static string GetQQUserInfoJsonStr(string access_token, string openid)
        {
            string url = string.Format("https://graph.qq.com/user/get_user_info?access_token={0}&oauth_consumer_key={1}&openid={2}", access_token, appId, openid);
            string result = HttpMethodHelper.HttpGet(url, Encoding.UTF8);
            return result;
        }
        public static QQUserInfo GetQQUserInfoTest()
        {
            string url = string.Format("https://graph.qq.com/user/get_user_info?access_token={0}&oauth_consumer_key={1}&openid={2}", "", appId, "");
            string result = HttpMethodHelper.HttpGet(url, Encoding.UTF8);
            QQUserInfo qqUserInfo = JsonConvert.DeserializeObject<QQUserInfo>(result);
            return qqUserInfo;
        }



        /// <summary>
        /// 截取字符串中两个字符串中的字符串
        /// </summary>
        /// <param name="str">字符串</param>
        /// <param name="startStr">开始字符串</param>
        /// <param name="endStr">结束字符串</param>
        /// <returns></returns>
        public static string CutString(string str, string startStr, string endStr)
        {
            int begin, end;
            begin = str.IndexOf(startStr, 0) + startStr.Length; //开始位置   
            end = str.IndexOf(endStr, begin);            //结束位置     
            return str.Substring(begin, end - begin);   //取搜索的条数，用结束的位置-开始的位置,并返回     
        }
    }
```


### QQUserInfo.cs

```csharp
/// <summary>
/// QQ授权之后返回的字段
/// </summary>
public class QQUserInfo
{
    
    public int is_lost { get; set; }
    public string figureurl_type { get; set; }

    /// <summary>
    /// 地区 省（隐藏显示则返回空）
    /// </summary>
    public string province { get; set; }
    /// <summary>
    /// 地区 市（隐藏显示则返回空）
    /// </summary>
    public string city { get; set; }
    /// <summary>
    /// 出生日期 年份（隐藏显示则返回空）
    /// </summary>
    public string year { get; set; }
    /// <summary>
    /// 星座
    /// </summary>
    public string constellation { get; set; }
    /// <summary>
    /// 返回码 0返回成功
    /// </summary>
    public int ret { get; set; }
    /// <summary>
    /// 如果ret小于0，会有相应的错误信息提示，返回数据全部用UTF-8编码。
    /// </summary>
    public string msg { get; set; }
    /// <summary>
    /// 用户在QQ空间的昵称。
    /// </summary>
    public string nickname { get; set; }
    /// <summary>
    /// 大小为30×30像素的QQ空间头像URL。
    /// </summary>
    public string figureurl { get; set; }
    /// <summary>
    /// 大小为50×50像素的QQ空间头像URL。
    /// </summary>
    public string figureurl_1 { get; set; }
    /// <summary>
    /// 大小为100×100像素的QQ空间头像URL。
    /// </summary>
    public string figureurl_2 { get; set; }
    /// <summary>
    /// 上传的QQ头像原图
    /// </summary>
    public string figureurl_qq { get; set; }
    /// <summary>
    /// 大小为40×40像素的QQ头像URL。
    /// </summary>
    public string figureurl_qq_1 { get; set; }
    /// <summary>
    /// 大小为100×100像素的QQ头像URL。需要注意，不是所有的用户都拥有QQ的100x100的头像，但40x40像素则是一定会有。
    /// </summary>
    public string figureurl_qq_2 { get; set; }
    /// <summary>
    /// 性别。 如果获取不到则默认返回"男"
    /// </summary>
    public string gender { get; set; }
    /// <summary>
    /// 是否黄钻
    /// </summary>
    public string is_yellow_vip { get; set; }
    /// <summary>
    /// 是否vip
    /// </summary>
    public string vip { get; set; }
    /// <summary>
    /// 黄钻等级
    /// </summary>
    public string yellow_vip_level { get; set; }
    /// <summary>
    /// vip等级
    /// </summary>
    public string level { get; set; }
    /// <summary>
    /// 是否年费黄钻
    /// </summary>
    public string is_yellow_year_vip { get; set; }
}
```


拿到用户信息就说明授权成功了，然后就该走自己的逻辑流程了。。。。

QQ授权登录基本那就是这样实现的，根据这些步骤来操作基本你没有什么问题了