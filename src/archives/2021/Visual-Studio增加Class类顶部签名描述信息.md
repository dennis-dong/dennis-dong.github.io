---
title: Visual Studio增加Class类顶部签名描述信息
description: Visual Studio增加Class类顶部签名描述信息
date: 2021-12-23
category:
  - Visual Studio
tag:
  - Visual Studio
---

<!-- more -->

## 1. 找到安装路径

默认在 `C:\Program Files (x86)\Microsoft Visual Studio\`，然后进入到`2019\Professional\Common7\IDE\ItemTemplates\CSharp\Code\2052` 看到模板文件

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211223110833878-871090041.png)

## 2. 依次打开每个文件夹下的.cs文件
在顶部添加以下代码

```csharp
/*-----------------------------------------------------------------
 * 作  者（Author）：             Dennis
 * 日  期（Create Date）：        $time$
 * 公  司（Copyright）：          www.dennisdong.top
 * 文件名（File Name）：          $safeitemname$.cs
 * ----------------------------------------------------------------
 * 描  述（Description）：        $safeitemname$
 *----------------------------------------------------------------*/
```

## 3. 重启VS即可