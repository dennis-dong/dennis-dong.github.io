---
title: 解决centos7 yum和wget都不能使用
date: 2023-01-09
category:
  - CentOS
tag:
  - yum
  - apt-get
---

<!-- more -->

## 1.前言

因为卸载了centos 7.9.2009 内置自带的python2.7.5，导致yum无法使用，但是又没有安装wget，两者不能相互安装导致死循环

## 2.安装wget
找到自己对应的系统版本，我的是7.9.2009,64位操作系统

### 2.1 查看系统版本及操作位数
`cat /etc/centos-release`
`uname -m`
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230109145614506-1062659239.png)

### 2.2 下载安装包
[网易镜像库 http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages](http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages)
[阿里云镜像库 https://mirrors.aliyun.com/centos/7.9.2009/os/x86_64/Packages](https://mirrors.aliyun.com/centos/7.9.2009/os/x86_64/Packages)

自行替换自己的系统版本，找到`wget-1.14-18.el7_6.1.x86_64.rpm`下载即可

### 2.3 拷贝安装包进行安装
将下载好的wget安装包拷贝到对应的目录，然后cd到对应目录执行以下命令
如：拷贝到`/home`下之后，执行 `cd /home`,然后安装即可

```sh
rpm -ivh wget-1.14-18.el7_6.1.x86_64.rpm
```

## 3.安装yum
### 3.1 卸载python
```sh
##强制删除已安装程序及其关联
rpm -qa|grep python|xargs rpm -ev --allmatches --nodeps

##删除所有残余文件 ##xargs，允许你对输出执行其他某些命令
whereis python |xargs rm -frv -rf

##验证删除，返回无结果
whereis python
```

### 3.2 删除yum
```sh
rpm -qa|grep yum|xargs rpm -ev --allmatches --nodeps
whereis yum |xargs rm -frv -rf
```

### 3.3 下载依赖包
能联网的话直接复制运行即可（注意下载路径，会下载到当前路径下），如果不能联网就自己手动下载然后拷贝到服务器上

```sh
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/lvm2-python-libs-2.02.187-6.el7.x86_64.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/libxml2-python-2.9.1-6.el7.5.x86_64.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages//python-libs-2.7.5-89.el7.x86_64.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/python-ipaddress-1.0.16-2.el7.noarch.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/python-backports-1.0-8.el7.x86_64.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/python-backports-ssl_match_hostname-3.5.0.1-1.el7.noarch.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/python-2.7.5-89.el7.x86_64.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/python-iniparse-0.4-9.el7.noarch.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/python-pycurl-7.19.0-19.el7.x86_64.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/python-urlgrabber-3.10-10.el7.noarch.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/python-setuptools-0.9.8-7.el7.noarch.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/python-kitchen-1.1.1-5.el7.noarch.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/python-chardet-2.2.1-3.el7.noarch.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/rpm-python-4.11.3-45.el7.x86_64.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/yum-utils-1.1.31-54.el7_8.noarch.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/yum-3.4.3-168.el7.centos.noarch.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/yum-metadata-parser-1.1.4-10.el7.x86_64.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/yum-plugin-aliases-1.1.31-54.el7_8.noarch.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/yum-plugin-protectbase-1.1.31-54.el7_8.noarch.rpm
wget http://mirrors.163.com/centos/7.9.2009/os/x86_64/Packages/yum-plugin-fastestmirror-1.1.31-54.el7_8.noarch.rpm
 
```

### 3.4 安装替换依赖
````sh
rpm -Uvh --replacepkgs *.rpm
````

### 3.5 测试
`yum`
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230109154038580-808690065.png)

`python`
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230109154056392-2020452840.png)


## 4.yum源处理
### 4.1 删除yum源
```sh
rm -rf /etc/yum/.repos.d/*
```

### 4.2 下载阿里云yum源
[http://mirrors.aliyun.com/repo/Centos-7.repo](http://mirrors.aliyun.com/repo/Centos-7.repo)

### 4.3 拷贝yum源
把下载好的`Centos-7.repo`拷贝到`/etc/yum.repos.d/`下，没有该文件夹就手动新建一个

### 4.4 清除和生成yum缓存
```sh
## 清除缓存
yum clean all

## 生成缓存
yum makecache
```

## 5.参考文档：
[https://blog.csdn.net/qq_39399966/article/details/118996568](https://blog.csdn.net/qq_39399966/article/details/118996568)
[https://www.jianshu.com/p/fba41e28eef3](https://www.jianshu.com/p/fba41e28eef3)