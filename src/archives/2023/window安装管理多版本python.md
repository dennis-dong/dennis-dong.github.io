---
title: window安装管理多版本python
description: window安装管理多版本python
date: 2023-07-07
category:
  - Windows
  - Python
tag:
  - Python
---

<!-- more -->

本文是安装的`python3.6.8`和`python3.8.8`测试

## 1.下载python安装程序
[https://www.python.org/downloads/](https://www.python.org/downloads/)
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230707212342244-319186335.png)

## 2.安装
### 2.1 安装方式
根据自己需求选择安装方式，一般选择第一个即可（如果需要更改安装路径选第二个），勾选下面的添加到环境变量中
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230707224452982-1772415095.png)

### 2.2 安装完成
安装完成会生成对应版本文件夹
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230707212853694-702220151.png)

## 3.多版本管理
### 3.1 新建`bat`
文件在安装路径下新建对应版本的`bat`文件用于区分版本，文件内容如下，替换自己的安装路径即可

**`3.6`版本**
```sh
@echo off
C:\Users\***\AppData\Local\Programs\Python\Python36\python.exe %*
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230707213205247-2134954490.png)

**`3.8`版本**
```sh
@echo off
C:\Users\***\AppData\Local\Programs\Python\Python38\python.exe %*
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230707213238112-2013983472.png)

### 3.2 测试
打开`cmd`分别输入`python36`和`python38`
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230707213511323-643642061.png)

### 3.3 `pip`管理
同样在控制台输入`pip --version`和`pip3.6 --version`和`pip3.8 --version`
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230707213901719-1756556492.png)

**注意：** 
> 1. 我这是升级`pip`之后的输出，新安装时会提示升级`pip`，我们**不要**直接复制，需要把对应的`python`替换为版本号才可以
> 2. 这里的`pip`是`环境变量中靠前`的那个版本，并不是固定为某个版本，如图所示
> ![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230707214919945-1787833737.png)

```sh
python36 -m pip install --upgrade pip
或
python38 -m pip install --upgrade pip
```

### 3.4 安装依赖
到这我们就可以管理不同的版本了，安装第三方包时可以用对应版本的`pip`即可，尽量不要直接使用不带版本号的`pip`
```sh
pip3.6 install yapf
或
pip3.8 install yapf
```

## 4.创建虚拟的环境
为了使每个项目有自己的环境，不适用本地的全局环境，这样就方便每个项目的版本选择已经各种包的依赖更好的管理，所以一般都会创建单独的虚拟环境
具体做法参考另一篇文章
[https://www.dennisdong.top/archives/2023/python项目创建虚拟环境.html](https://www.dennisdong.top/archives/2023/python项目创建虚拟环境.html)