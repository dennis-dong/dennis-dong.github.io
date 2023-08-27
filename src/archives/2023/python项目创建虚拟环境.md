---
title: python项目创建虚拟环境
description: python项目创建虚拟环境
date: 2023-07-07
category:
  - Python
tag:
  - Python
  - 虚拟环境
---

<!-- more -->

## 1.为什么要使用虚拟环境

Q：为什么要使用虚拟环境呢，直接用本地的全局环境不就可以了吗？
A：原因在于创建单独的虚拟环境方便每个项目依赖管理，避免因为全局环境有，发布上线时缺包少包带来的问题

## 2.安装虚拟环境构建工具
### 2.1 原生自带（不推荐）
`python 3.3`以后会自带一个构建虚拟环境的工具叫`venv`
```sh
python -m venv 虚拟环境的名称
```
名称一般也会叫`venv`，一是虚拟环境的简写，二是`vscode`可以自动检测到该虚拟环境
### 2.2 使用`virtualenv`（推荐）
#### 2.2.1 独立`python`环境
```sh
pip install virtualenv
```
如果安装的很慢可以指定国内清华镜像源
```sh
pip install virtualenv -i https://pypi.tuna.tsinghua.edu.cn/simple
```

#### 2.2.2 多版本`python`环境
```sh
pip版本号 install virtualenv
```
多版本管理请移步
[https://www.dennisdong.top/archives/2023/window安装管理多版本python.html](https://www.dennisdong.top/archives/2023/window安装管理多版本python.html)

## 3.构建虚拟环境
在项目根目录打开控制台，输入以下命令，产生的**虚拟环境**的`python`版本是根据**命令中**`python`的版本为依据的
### 3.1 独立`python`环境
```sh
python -m virtualenv 虚拟环境的名称
或
virtualenv 虚拟环境的名称
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230707222800286-1196180125.png)
执行完成后会多一个`venv`的文件夹

### 3.2 多版本`python`环境
建议使用这种，因为直接使用`virtualenv`不能指定使用哪个`python`版本下的`virtualenv`
```sh
python版本号 -m virtualenv 虚拟环境的名称
```

### 3.3 激活虚拟环境
```sh
venv\Scripts\activate
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230707222904368-1428494467.png)
激活后，最前面会显示虚拟环境的名称`venv`，输入`pip list`也可以看到`pip`是虚拟环境的

## 4.初始化项目
一般都会在项目中创建一个所需依赖包的文件`requirement.txt`，里面写好了对应依赖以及具体的版本号，比如
```sh
yapf==0.40.1
SQLAlchemy==1.4.22
PyMySQL==1.0.2
pyotp==2.6.0
cryptography==37.0.2
APScheduler==3.10.1
requests==2.27.1
ldap3==2.9.1
```
### 4.1 安装项目依赖
在当前的虚拟环境中安装项目依赖
```sh
pip install -r requirement.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```
至此，虚拟环境以及项目依赖已经构建好了

## 5.多版本`python`管理
[https://www.dennisdong.top/archives/2023/window安装管理多版本python.html](https://www.dennisdong.top/archives/2023/window安装管理多版本python.html)