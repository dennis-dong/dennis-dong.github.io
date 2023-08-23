---
title: vs code 关联gitee码云或github以及GIT 常用命令
date: 2021-03-03
category:
  - Visual Studio Code
tag:
  - Visual Studio Code
---

<!-- more -->

## 一、准备

### 1、本地安装vs code 和GIT源代码管理工具

### 2、配置vscode git全局变量
打开左下角设置-->点击用户-->搜索`git.path`-->`settings.json`中编辑-->`git.path`值改为`git.exe`的安装路径  eg：`D:\Program Files\Git\bin\git.exe`
### 3、在项目文件路径下 GIT Bash 执行 以下命令
#### 3.1 克隆存储库
`git clone https://www.yourgiturlxxxx.git`
#### 3.2 添加当前文件夹的文件监控
`git add .`
#### 3.3 提交到本地
`git commit -m "备注信息"`
#### 3.4 推送到远程存储库
`git push`
### 4、vscode 打开项目工作区操作即可
【源代码管理】中提交只是本地提交，提交至远程存储库需要在【源代码管理仓库】中推送

## 二、GET 常用命令
### 1、克隆仓库
`git clone https://www.yourgiturlxxxx.git`
### 2、拉取仓储库内容
`git pull`
### 3、提交内容
`git commit -m "init"`
### 4、关联仓库地址
`git remote add origin https://www.yourgiturlxxxx.git`
### 5、推送至远程仓库（需要有README.md文件，不然提示failed to push some refs to ...）
`git push -u origin master`
### 6、查看当前远程地址
`git remote -v`
### 7、修改远程仓库地址
`git remote set-url origin <new url>`
### 8、删除关联地址
`git remote remove <url>`

## 三、ignore文件失效问题

提交过想忽略文件之后，即使添加ignore忽略文件也没用，这时需要以下几个步骤
### 1.打开git命令窗口，cd进入项目目录
### 2.删除想要忽略的服务器文件
删除文件：`git rm -r --cached a.txt`
删除bin下所有文件：`git rm -r --cached bin/*`
删除当前目录(注意当前路径，**先cd进入要删除的目录**，别删错了)：`git rm -r --cached .`
### 3.添加文件监控
`git add .`
### 4.提交
`git commit -m "commit desctiption"`
### 5.推送
`git push`