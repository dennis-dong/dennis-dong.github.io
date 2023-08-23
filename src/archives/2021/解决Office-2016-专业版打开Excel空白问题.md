---
title: 解决Office 2016 专业版打开Excel空白问题
date: 2021-07-20
category:
  - Windows
tag:
  - Office
---

<!-- more -->

## 一.打开注册表

### 1.Win+R 输入 regedit 回车
### 2.找到路径 HKEY_CLASSES_ROOT\Excel.Sheet.12\shell\Open\command 更改默认值为 "C:\Program Files\Microsoft Office\Root\Office16\EXCEL.EXE" "%1"
### 3.如果打开(.xls) 文件依然空白找到路径 HKEY_CLASSES_ROOT\.xls 更改默认值为 Excel.Sheet.12 即可

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20210806113305566-511912872.png)