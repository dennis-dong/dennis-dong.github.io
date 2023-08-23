---
title: Net和Net Core集成Swagger以及配合JWT身份验证
date: 2021-12-22
category:
  - Net
tag:
  - Swagger
---

<!-- more -->

## 一、Swagger介绍

简单来说swagger是一款WebAPI的接口管理帮助文档，并且可以直接进行接口测试

我们来看一下官网介绍 [https://swagger.io](https://swagger.io)

Swagger is a powerful yet easy-to-use suite of API developer tools for teams and individuals, enabling development across the entire API lifecycle, from design and documentation, to test and deployment.
Swagger 是一套功能强大且易于使用的 API 开发人员工具套件，适用于团队和个人，支持从设计和文档到测试和部署的整个 API 生命周期的开发。

Swagger consists of a mix of open source, free and commercially available tools that allow anyone, from technical engineers to street smart product managers to build amazing APIs that everyone loves.
Swagger 包含开源、免费和商用工具的组合，允许任何人，从技术工程师到街头智能产品经理，构建每个人都喜欢的令人惊叹的 API。

Swagger is built by SmartBear Software, the leader in software quality tools for teams. SmartBear is behind some of the biggest names in the software space, including Swagger, SoapUI and QAComplete.
Swagger 由 SmartBear Software 构建，SmartBear Software 是团队软件质量工具的领导者。SmartBear 是软件领域一些大牌的幕后推手，包括 Swagger、SoapUI 和 QAComplete。

## 二、.Net中集成Swagger
### 1. NuGet包安装Swashbuckle
搜索Swashbuckle,下载并安装(我的是5.6.0)

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211222130205027-387495357.png)

安装完之后会生成Swagger文件夹和App_Start下的SwaggerConfig文件

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211222130532549-1598434088.png)

### 2. 修改SwaggerConfig
里面有很多方法被注释掉，也基本都用不上，所以我就删了，只保留了常用的方法

```csharp
    /// <summary>
    /// Swagger Config
    /// </summary>
    public class SwaggerConfig
    {
        /// <summary>
        /// Swagger Register
        /// </summary>
        public static void Register()
        {
            GlobalConfiguration.Configuration
                .EnableSwagger(c =>
                {
                    //文档抬头说明
                    c.SingleApiVersion("v1", "").Description("请先登录获取token放置api_key输入框中，作为header参数认证凭据");
                    //文档接口、参数说明等
                    c.IncludeXmlComments(GetXmlCommentsPath());
                })
                .EnableSwaggerUi(c =>
                {
                    //默认页面替换，为什么要替换，因为原生的不好用（你可以注释掉这行代码体验一下）
                    c.CustomAsset("index", typeof(SwaggerConfig).Assembly, "PLM.WebAPI.Swagger.index.html");
                });
        }

        private static string GetXmlCommentsPath()
        {
            return $"{AppDomain.CurrentDomain.BaseDirectory}/bin/PLM.WebAPI.xml";
        }
    }
```
### 3. 配置XML注释文档
需要在项目属性中勾选XML文档

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211222135433666-1651324414.png)

### 4. index.html替换
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>PLM WebApi</title>
    <link rel="icon" type="image/png" href="images/logo_small-png.png" sizes="32x32" />
    <link href="css/typography-css.css" media="screen" rel="stylesheet" type="text/css" />
    <link href="css/reset-css.css" media="screen" rel="stylesheet" type="text/css" />
    <link href="css/screen-css.css" media="screen" rel="stylesheet" type="text/css" />
    <link href="css/reset-css.css" media="print" rel="stylesheet" type="text/css" />
    <link href="css/print-css.css" media="print" rel="stylesheet" type="text/css" />

    <script src="lib/object-assign-pollyfill-js.js" type="text/javascript"></script>
    <script src="lib/jquery-1-8-0-min-js.js" type="text/javascript"></script>
    <script src="lib/jquery-slideto-min-js.js" type="text/javascript"></script>
    <script src="lib/jquery-wiggle-min-js.js" type="text/javascript"></script>
    <script src="lib/jquery-ba-bbq-min-js.js" type="text/javascript"></script>
    <script src="lib/handlebars-4-0-5-js.js" type="text/javascript"></script>
    <script src="lib/lodash-min-js.js" type="text/javascript"></script>
    <script src="lib/backbone-min-js.js" type="text/javascript"></script>
    <script src="swagger-ui-min-js.js" type="text/javascript"></script>
    <script src="lib/highlight-9-1-0-pack-js.js" type="text/javascript"></script>
    <script src="lib/highlight-9-1-0-pack_extended-js.js" type="text/javascript"></script>
    <script src="lib/jsoneditor-min-js.js" type="text/javascript"></script>
    <script src="lib/marked-js.js" type="text/javascript"></script>
    <script src="lib/swagger-oauth-js.js" type="text/javascript"></script>

    <script type="text/javascript">
        $(function () {
            window.swaggerUi = new SwaggerUi({
                url: window.location.origin + "/Swagger/docs/v1",
                dom_id: "swagger-ui-container",
                supportedSubmitMethods: ["get", "post"],
                onComplete: function (swaggerApi) {
                    window.swaggerApi = swaggerApi;
                },
                onFailure: function () {
                    console.log("Unable to Load SwaggerUI");
                },
                jsonEditor: true,//表单编辑器
                showRequestHeaders: false,//显示请求头
                validatorUrl: null,//json验证
                docExpansion: 'none'//是否展开 none list full
            });

            function addApiKeyAuthorization() {
                var key = $("#input_apiKey").val();
                if (key && key.trim() !== "") {
                    var apiKeyAuth = new SwaggerClient.ApiKeyAuthorization("Authorization", key, "header");
                    window.swaggerUi.api.clientAuthorizations.add("api_key", apiKeyAuth);
                }
            }

            $("#input_apiKey").change(addApiKeyAuthorization);
            window.swaggerUi.load();
        });
    </script>
</head>

<body class="swagger-section">
    <div id="header">
        <div class="swagger-ui-wrap">
            <a id="logo" href="javascript:;"><span class="logo__title">PLM WebApi</span></a>
            <form id="api_selector">
                <div class="input">
                    <input placeholder="api_key" id="input_apiKey" name="apiKey" type="text" autocomplete="off" />
                </div>
            </form>
        </div>
    </div>

    <div id="swagger-ui-container" class="swagger-ui-wrap"></div>
</body>
</html>
```
### 5. 使用方法
运行项目之后，在后面加上/swagger即可，如https://localhost:8099/swagger
你可以设置默认页，默认启动之后打开Swagger文档主页

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211222140219018-703665942.png)

## 三、.Net Core中集成Swagger
**PS：`.Net5` 以上自带集成Swagger**，直接跳过集成，查看JWT使用即可

### 1. NuGet包安装Swashbuckle.AspNetCore
搜索Swashbuckle.AspNetCore，下载并安装(我的是5.6.3)

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211222145048117-544263428.png)

### 2. 配置Startup
在`ConfigureServices`方法中添加代码

```csharp
    services.AddSwaggerGen(c =>
    {
        //获取注释文档路径  bin\Debug\net5.0\NetCoreApiDemo.xml
        var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);

        //显示方法注释
        c.IncludeXmlComments(xmlPath, true);
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "NetCoreApi", Version = "v1" });
    });
```

在 `Configure` 方法中添加代码
尽量靠前，添加在`if (env.IsDevelopment()){}`后面即可

```csharp
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "NetCoreApiDemo v1");
        c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None); //折叠Api
        c.DefaultModelsExpandDepth(-1); //去除Model 显示
    });
```
### 3. 设置swagger为起始页
在Properties文件夹中的`launchSettings.json`中更改launchUrl为swagger即可

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211222150627341-2024944533.png)

## 四、JWT配合使用
如果用到JWT授权，请先参考文章 [https://www.dennisdong.top/archives/2021/NET和NET-Core使用JWT授权验证.html](http://www.dennisdong.top/archives/2021/NET和NET-Core使用JWT授权验证.html) 弄好JWT相关配置

#### 1. .NET中使用
将获取的`Jwt Token` 放置右上角的文本框中即可

#### 2. .NET Core中使用
在Startup的`ConfigureServices`方法中找到`services.AddSwaggerGen`并添加配置

```csharp
    services.AddSwaggerGen(c =>
    {
        //添加Jwt验证设置,添加请求头信息
        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Id = "Bearer",
                        Type = ReferenceType.SecurityScheme
                    }
                },
                new List<string>()
            }
        });

        //放置接口Auth授权按钮
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "Value Bearer {token}",
            Name = "Authorization",//jwt默认的参数名称
            In = ParameterLocation.Header,//jwt默认存放Authorization信息的位置(请求头中)
            Type = SecuritySchemeType.ApiKey
        });
    });
```

点击授权按钮，把JWT Token 填入文本框中点击登录即可
**PS：** 格式为 Bearer + 空格 + Token

## 五、跨域问题
请参考文章 [https://www.dennisdong.top/archives/2021/NET-WebAPI-跨域问题(CORS-policy-No-Access-Control-Allow-Ogigin).html](https://www.dennisdong.top/archives/2021/NET-WebAPI-跨域问题(CORS-policy-No-Access-Control-Allow-Ogigin).html)

## 六、源码地址
Gitee：[https://gitee.com/dennisdong/net-coreapi-demo](https://gitee.com/dennisdong/net-coreapi-demo)