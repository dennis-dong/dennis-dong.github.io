---
title: NET WebAPI 跨域问题(CORS policy No Access-Control-Allow-Ogigin)
date: 2021-12-23
category:
  - Net
tag:
  - Cors
---

<!-- more -->

## 一、什么是跨域

### 1. 跨域解释
跨域指的是浏览器不能执行其他网站的脚本。它是由浏览器的同源策略造成的，是浏览器施加的安全限制。
同源指的是：域名，协议，端口均相同。

### 2. 什么情况下会导致跨域
#### 2.1 不同域名(无论主域名还是子域名)
www.dennis.com 访问 www.dong.com

#### 2.2 不同端口号
www.dennis.com 访问 www.dennis.com:8080

#### 2.3 不同协议
http://www.dennis.com 访问 https://www.dennis.com

#### 2.4 本地指向
localhost 访问 127.0.0.1

## 二、如何解决跨域
### 1. .NET 版本
#### 1.1 NuGet包安装Microsoft.AspNet.Cors
搜索Microsoft.AspNet.Cors，下载并安装

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211222160414350-1932762653.png)

#### 1.2 配置 WebApiConfig
打开APP_Start文件夹下的 WebApiConfig，最后面加上 `config.EnableCors();` 即可
当然这个有重载，支持固定的域名访问和固定的请求方式，可以自行测试

第一个参数是过滤域名的，多个用英文逗号隔开
第二个参数是过滤header的，没测试过，有兴趣自行测试
第三个参数是过滤请求方式的，多个用英文逗号隔开
如：`config.EnableCors(new EnableCorsAttribute("*", "*", "*"));` 允许所有域名，所有请求方式的方法
如：`config.EnableCors(new EnableCorsAttribute("https://www.dennis.com", "*", "get,post"));` 允许www.dennis.com域名，所有get和post请求方式的方法

### 2. .NET Core 版本
#### 2.1 配置Startup
Startup中声明全局私有常量

```csharp
    /// <summary>
    /// 跨域配置名称
    /// </summary>
    private const string DefaultCorsPolicyName = "AllowCross";
```

在`ConfigureServices`方法中添加

```csharp
    services.AddCors(options =>
    {
        options.AddPolicy(DefaultCorsPolicyName, builder =>
        {
            builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        });
    });
```

在`Configure`方法中的`app.UseRouting();//路由`后面添加
`app.UseCors(DefaultCorsPolicyName);//跨域`