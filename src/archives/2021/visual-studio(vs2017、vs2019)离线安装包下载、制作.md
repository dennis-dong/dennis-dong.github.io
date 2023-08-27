---
title: visual studio(vs2017、vs2019)离线安装包下载、制作
description: visual studio(vs2017、vs2019)离线安装包下载、制作
date: 2021-12-16
category:
  - Visual Studio
tag:
  - Visual Studio
---

<!-- more -->

## 一、下载安装引导程序(以vs-professional-2019为例)

[https://aka.ms/vs/16/release/vs_professional.exe](https://aka.ms/vs/16/release/vs_professional.exe)

## 二、在引导程序目录打开cmd命令窗口执行代码

### 1.命令模板 `vs_Professional.exe --layout 下载路径 --add 模块ID --lang 语言` 

### 2.以NET开发为例（包括.NET web和.NET desktop和.NET Core）

````sh
vs_Professional.exe --layout C:\vs_offline\vs_pro_2019_offline --add Microsoft.VisualStudio.Workload.ManagedDesktop --add Microsoft.VisualStudio.Workload.NetWeb --add Component.GitHub.VisualStudio --includeOptional --lang en-US
````

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211220103627788-1405601910.png)

**模块ID详细查看官方文档** 
[https://docs.microsoft.com/en-us/visualstudio/install/workload-component-id-vs-professional?view=vs-2019](https://docs.microsoft.com/en-us/visualstudio/install/workload-component-id-vs-professional?view=vs-2019)

### 3.回车执行命令

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211216154905100-1361898747.png)

### 4.下载完成

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211216154927796-1544124832.png)

### 5.查看下载

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211216155051667-9283334.png)

执行`vs_setup.exe`，不要执行`vs_Professional.exe`，这个只是引导包

### 6.安装注意事项（可能发生）

真实模拟：将电脑断网或在虚拟机上断网安装测试
注意事项：安装过程中可能会提示下载失败，直接点击【继续】忽略即可

### 7.安装完成

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211217132106776-424319028.png)

### 8.官方教程

[https://docs.microsoft.com/en-us/visualstudio/install/create-an-offline-installation-of-visual-studio?view=vs-2019](https://docs.microsoft.com/en-us/visualstudio/install/create-an-offline-installation-of-visual-studio?view=vs-2019)