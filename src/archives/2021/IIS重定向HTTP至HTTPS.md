---
title: IIS重定向HTTP至HTTPS
description: IIS重定向HTTP至HTTPS
date: 2021-05-06
category:
  - IIS
tag:
  - HTTP重定向
---

<!-- more -->

## 一、安装URL重写模块，自行百度下载

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20210303114359016-354042594.png)

## 二、选择网站进行添加规则
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20210303114421348-1367818251.png)
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20210303114433104-1798533282.png)

## 三、总结
其实就是在站点的Web.config增加了一段配置：
```xml
<system.webServer>
        <rewrite>
            <rules>
                <rule name="http转https" stopProcessing="true">
                    <match url="(.*)" />
                    <conditions>
                        <add input="{HTTPS}" pattern="off" />
                    </conditions>
                    <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" />
                </rule>
            </rules>
        </rewrite>
</system.webServer>
```
如果下一个站点也需要设置HTTP重定向HTTPS，直接在Web.config增加这段配置即可。