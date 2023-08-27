---
title: centos7 在线或离线安装python3
description: centos7 在线或离线安装python3
date: 2023-01-09
category:
  - CentOS
tag:
  - Python
---

<!-- more -->

## 1.前言
本文会使用到yum和wget，如果两者都不能用，参考安装教程
[https://www.dennisdong.top/archives/2023/解决centos7%20yum和wget都不能使用.html](https://www.dennisdong.top/archives/2023/解决centos7%20yum和wget都不能使用.html)

## 2.查看是否安装wget和yum
`wget`
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230109155759280-479247462.png)

`yum`
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230109160002248-286450856.png)

## 3.安装wget
`yum install -y wget`
如果不能联网，请参考上方链接

### 3.1 下载python安装包
注意下载路径为当前目录，如果`不能联网就手动下载`之后上传到服务器即可
`wget https://www.python.org/ftp/python/3.6.8/Python-3.6.8.tgz`

### 3.2 解压
`tar -zxvf Python-3.6.8.tgz`

### 3.3 编译python
`cd Python-3.6.8/`
`./configure --prefix=/usr/local/python3`
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230109160825766-340800885.png)

**如果报错 `configure: error: no acceptable C compiler found in $PATH` 安装`gcc`即可**

### 3.4 安装gcc（在线）
`yum install gcc`

### 3.5 安装gcc（离线）
如果`不能联网就手动下载`依赖包,上传到服务器上
[https://niceyoo.lanzoux.com/i5nIdmx2n9e](https://niceyoo.lanzoux.com/i5nIdmx2n9e)

#### 3.5.1 解压gcc
`tar -zxvf gcc.tar.gz`

#### 3.5.2 安装依赖
```sh
cd gcc
rpm -Uvh *.rpm --nodeps --force
```
等待安装完成即可

### 3.5 安装python
`make && make install`
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230109161324210-686986172.png)

因为我已经安装过了，第一次安装会提示安装成功提示 `Successfully installed xxxxx`

### 3.6 设置软连接
```sh
ln -s /usr/local/python3/bin/python3 /usr/bin/python3
ln -s /usr/local/python3/bin/pip3 /usr/bin/pip3
```

### 3.7 测试
`python3` 进入python说明安装成功
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230109162312014-86444975.png)

`pip3 list` 查看安装的python依赖包
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230109162441786-243534739.png)

至此python3安装完成

## 4.参考文档
[https://blog.csdn.net/qq_42598133/article/details/109671364](https://blog.csdn.net/qq_42598133/article/details/109671364)
[https://www.cnblogs.com/niceyoo/p/14532228.html](https://www.cnblogs.com/niceyoo/p/14532228.html)