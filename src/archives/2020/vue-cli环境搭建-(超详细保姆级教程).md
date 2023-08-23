---
title: vue-cli环境搭建 (超详细保姆级教程)
date: 2020-09-24
category:
  - NodeJS
tag:
  - NodeJS
---

<!-- more -->

## 一、使用之前，我们先来掌握3个东西是用来干什么的。

npm: Nodejs下的包管理器。
webpack: 它主要的用途是通过CommonJS的语法把所有浏览器端需要发布的静态资源做相应的准备，比如资源的合并和打包。
vue-cli: 用户生成Vue工程模板。（帮你快速开始一个vue的项目，也就是给你一套vue的结构，包含基础的依赖库，只需要 npm install就可以安装）

## 二、安装node.js
[官网：https://nodejs.org/en/](https://nodejs.org/en/)

本文演示最新版本，可自行选择其他版本
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211217165909396-675220990.png)

[所有node版本：https://nodejs.org/dist/](https://nodejs.org/dist/)

### 1. 双击打开下载的.msi安装文件开始安装(全程下一步即可)
### 2. 目录结构说明
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221204155431647-1968117401.png)

## 三、配置npm管理器
### 1. 查看信息
管理员身份运行cmd或者 **win+x** 选择 **windows powershell 管理员**
查看本地环境变量PATH属性值 `echo %path%`
查看安装的node.js版本：`node -v`
查看安装的node.js自带npm包管理器版本：`npm -v`
如图有node和npm版本删除代表安装成功
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221204163217805-1478215273.png)

### 2. npm全局路径
执行命令`npm config ls -g` 可以看到默认的全局配置路径
默认是 `C:\Users\Administrator\AppData\Roaming\npm`，我们来把他单独配置出来
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221204163725148-1919007240.png)

#### 2.1 新建全局配置文件夹
新建`node_global`文件夹作为node各种包的全局路径，根据个人习惯把它放到nodejs安装目录中
新建`node_cache`文件夹作为node各种包处理出错时的日志记录，根据个人习惯也把它放到nodejs安装目录中
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211221153035122-1515688576.png)

#### 2.2 更改默认配置
更改成功后会在`C:/Users/Administrator`下多一个`.npmrc`的文件
`npm config set prefix "C:\Program Files\nodejs\node_global"`
`npm config set cache "C:\Program Files\nodejs\node_cache"`
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221204164301636-1032279829.png)

#### 2.3 配置环境变量
此电脑-->右键属性-->高级系统设置-->环境变量-->用户变量和系统变量中找到Path，改完后不会立即生效，需要重新打开一个新的cmd窗口
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221204165800097-1837553491.png)

### 3. 配置npm镜像用于加速国内访问
#### 3.1安装nrm查看所有镜像站地址
`npm install nrm -g`
安装好后会在`node_global/node_modules`文件夹中多一个`nrm`的文件夹
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221204165001650-1967369014.png)

#### 3.2 查看镜像站
 查看可用镜像站 `nrm ls`
 测试镜像站速度 `nrm test`
*号代表当前使用的镜像站

#### 3.3 替换taobao镜像站
npm服务器在国外，不配置的话下载可能会很慢或者根本连不上
`nrm use taobao`

#### 3.4.查看是否配置成功
输入 `npm config ls -g` 查看配置是否更改成功
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221204170519446-1895856433.png)

### 4. 查看全局安装的依赖包
`npm ls -g --depth=0` 可以看到刚才安装的nrm
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221204170828250-1205046930.png)

## 四.安装Vue相关环境
### 1. 安装vue-cli
**PS：如果已经安装过其他版本，需要升级或降级，先卸载再重新安装**
卸载：`npm uninstall vue-cli -g` 或 `npm uninstall @vue/cli -g`

`vue-cli`是vue-cli 2.x版本的名称
`@vue/cli`是vue-cli 3.x及以上版本的名称
安装2.x最新版：`npm install vue-cli -g`
安装目前最新版 `npm install @vue/cli -g`

当然你也可以指定版本安装
查看脚手架版本号：`npm view vue-cli versions --json` 或 `npm view @vue/cli versions --json`
安装命令：`npm install vue-cli@版本号 -g` 或 `npm install @vue/cli@版本号 -g`

### 2. 查看安装结果
`vue -V` 或`vue --version` 有本版输出即为安装成功

## 五、新建项目测试(打开cmd切换到想要新建项目的目录路径)
### 1. vue-cli 2.x 初始化项目
`vue init webpack cli2test`

### 2. vue-cli 3.x 及以上
`vue create cli3test`
PS：vue-cli 2.x 和3.x 创建的目录结构是不同的

#### 2.1 使用cli 3.x创建cli 2.x的项目
如果安装的是vue-cli 3.x 及以上，需要先安装vue-cli 2.x 的初始化模板
`npm install -g @vue/cli-init` 或 `npm install -g @vue/cli-init@对应版本号`

#### 2.2 初始化cli 2.x项目
`vue init webpack cli3to2test`

### 3. 运行项目
进入项目目录 `cd 项目路径`
vue-cli 2.x 使用 `npm run dev` 启动
vue-cli 3.x 使用 `npm run serve` 启动

浏览器打开下方连接地址即可