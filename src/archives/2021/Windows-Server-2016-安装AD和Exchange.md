---
title: Windows Server 2016 安装AD和Exchange
description: Windows Server 2016 安装AD和Exchange
date: 2021-08-06
category:
  - Windows
  - AD
  - Exchange
tag:
  - AD
  - Exchange
---

<!-- more -->

# 一.AD虚拟机操作

### 1.安装net framework 4.8 

`下载链接：`https://dotnet.microsoft.com/download/dotnet-framework/net48

## 安装AD管理工具

### 1.打开服务器管理器，添加角色和功能
### 2.选择Active Directory域服务和DNS服务器
### 3.勾选包括管理工具
### 4.一直下一步，直到安装完成

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220106164655076-98036943.png)

## 配置域

### 1.点击右上角感叹号，点击【将此无服务器升级为域控制器】

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220106164813011-1246151659.png)

### 2.添加新林，根域名就是域名后缀，如dennis.com

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220106164851588-2032782329.png)

### 3.设置密码

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220106165452308-1499823237.png)

### 4.设置NetBOIOS 域名，就是登录的前缀,不用更改

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220106165535984-1015076377.png)

### 5.点击安装，安装完成后会自动重启

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220118141220312-663438680.png)

# 二.EXchange 虚拟机操作

## 安装前提条件
### 1.打开网络设置将DNS指向AD虚拟机的公网IP地址

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220113150411884-902394367.png)

### 2.添加域，就是前面设置的域，如dennis.com

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220113150222667-90809897.png)

### 3.弹框账号密码填写Administrator和密码

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220113162036057-1428352817.png)

## 开始安装Exchange

### 4.以域账号Administrator账号登录

前面加上`AD`设置的`NetBIOS域名`，如`DENNIS\Administrator`

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220113162400648-469581411.png)

### 5.安装net framework 4.8 

`下载链接：`https://dotnet.microsoft.com/download/dotnet-framework/net48

### 6.管理员身份运行Windows Powershell，安装必需的 Windows组件：

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220113163903035-1446742792.png)

**安装命令**

```sh
Install-WindowsFeature NET-Framework-45-Features, Server-Media-Foundation, RPC-over-HTTP-proxy, RSAT-Clustering, RSAT-Clustering-CmdInterface, RSAT-Clustering-Mgmt, RSAT-Clustering-PowerShell, WAS-Process-Model, Web-Asp-Net45, Web-Basic-Auth, Web-Client-Auth, Web-Digest-Auth, Web-Dir-Browsing, Web-Dyn-Compression, Web-Http-Errors, Web-Http-Logging, Web-Http-Redirect, Web-Http-Tracing, Web-ISAPI-Ext, Web-ISAPI-Filter, Web-Lgcy-Mgmt-Console, Web-Metabase, Web-Mgmt-Console, Web-Mgmt-Service, Web-Net-Ext45, Web-Request-Monitor, Web-Server, Web-Stat-Compression, Web-Static-Content, Web-Windows-Auth, Web-WMI, Windows-Identity-Foundation, RSAT-ADDS
```

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220113164049721-273109279.png)

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220113164836185-2103630572.png)

### 7.安装Visual C++ Redistributable Package for Visual Studio 2013 
https://www.microsoft.com/en-us/download/details.aspx?id=40784

### 8.安装Microsoft统一通信托管API 4.0 核心运行时
https://www.microsoft.com/en-US/download/details.aspx?id=34992

### 9.安装exchange server 2016 CU14 下载后是一个镜像文件，打开里面的setup.exe安装
https://www.microsoft.com/en-us/download/details.aspx?id=100302 

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220113174759318-662135737.png)

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220113174824007-1763845369.png)

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220113174841087-476976368.png)

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220113174918041-440267795.png)

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220114100635104-1952908978.png)

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220114100754318-1288898954.png)

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220114113525211-462842156.png)

### 10.测试安装结果
安装成功之后重启服务器，访问https://localhost/ecp，输入账号和密码进入到邮件管理中心即可，以上操作无误代表安装完成
如果出现报错未找到"Microsoft Exchange Active Directory 拓扑"服务，就Win+R输入services.msc找到这个服务启动，刷新网页即可

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220114114920652-409664131.png)