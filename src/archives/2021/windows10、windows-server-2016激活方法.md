---
title: windows10、windows server 2016激活方法
description: windows10、windows server 2016激活方法
date: 2021-12-17
category:
  - Windows
tag:
  - Windows激活
---

<!-- more -->

## 1.激活准备

管理员打开cmd命令窗口(或者Windows+X组合键选择下图标注选项)，复制对应版本命令回车即可

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211220110251185-438554061.png)

## 2.激活命令：
### 2.1 win 10 专业版

```sh
slmgr /ipk W269N-WFGWX-YVC9B-4J6C9-T83GX
slmgr /skms kms.03k.org
slmgr /ato
```

### 2.2 win server 2016

```sh
slmgr /ipk CB7KF-BWN84-R7R2Y-793K2-8XDDG
slmgr /skms kms.03k.org
slmgr /ato
```

## 3.激活失败的话可以先执行卸载命令再安装

`slmgr.vbs /upk`

## 4.其他版本一样，更改秘密即可，密钥自行百度