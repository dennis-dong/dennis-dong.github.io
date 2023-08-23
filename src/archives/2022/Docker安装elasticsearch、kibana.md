---
title: Docker安装elasticsearch、kibana
date: 2022-10-29
category:
  - Docker
tag:
  - ES
  - Kibana
---

<!-- more -->

## 一. 安装7.x版本

以`elasticsearch 7.17.8`为例

### 1.安装elasticsearch

#### 1.1 拉取镜像
```sh
docker pull elasticsearch:7.17.8
```

#### 1.2 运行
```sh
docker run --name elasticsearch_7.17.8 -p 9200:9200 -e "discovery.type=single-node" elasticsearch:7.17.8
```

#### 1.3 访问elasticsearch
> 浏览器输入`localhost:9200`，如果成功返回es信息则成功，否则失败

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230413172206266-953001768.png)

### 2.安装Kibana
安装对应`elasticsearch`版本的`kibana`

#### 2.1 拉取镜像
```sh
docker pull kibana:7.17.8
```

#### 2.2 运行
这里的link需要跟elasticsearch容器的名称保持一致
```sh
docker run --name kibana_7.17.8 --link elasticsearch_7.17.8:elasticsearch -p 5601:5601 kibana:7.17.8
```

#### 2.3 访问kibana
> 浏览器输入`localhost:5601`，如果成功跳转到`kibana`页面则成功，否则失败

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230413172609766-1363859251.png)

`Dev Tools`也可以正常使用
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230413172711174-205620142.png)

## 二. 安装8.x版本
以`elasticsearch 8.5.0`为例
跟7.x步骤一样，把`tag`改成`8.5.0`即可

### 1.访问elasticsearch
与`7.x`不同的是，`8.x`增加了`x-pack`安全策略，需要通过`https`访问

> 浏览器输入`https://localhost:9200`，成功访问页面并弹出浏览器登录框，此时需要初始化帐号密码

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230413124840212-1222495384.png)

#### 1.1 初始化帐号密码
查看容器信息
```sh
docker ps
```
进入容器
```sh
docker exec -it f37e2e0d3dab /bin/bash
```

进入bin目录
```sh
cd bin/
```

查看命令列表
```sh
ls
```

初始化账号密码，依次输入各个内置帐号的密码即可
```sh
elasticsearch-setup-passwords interactive
```

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230413124816725-1193475019.png)
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230413124944004-291480404.png)

#### 1.2 登录elasticsearch
输入初始化的帐号elastic和对应的密码即可

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230413125218543-1932514872.png)

### 2. 访问kibana
> 浏览器输入`localhost:5601`，如果成功跳转到`kibana`页面则成功，否则失败

#### 2.1 生成授权token
进入`elasticsearch`容器内部的`bin`目录，执行命令

```sh
elasticsearch-create-enrollment-token -s kibana
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230413130326831-1045663258.png)

#### 2.2 验证token
复制生成的token输入到文本框中点击验证，这时可能会要求验证码
进入`kibana`容器内部的`bin`目录，执行命令，将验证码输入即可
```sh
kibana-verification-code
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230413130939778-243784242.png)

#### 2.3 登录elasticsearch
输入帐号`elastic`和对应的密码登录即可
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230413131159213-1532874822.png)

`Dev Tools`也可以正常使用
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230413173415846-1189386689.png)

## 三. 官方教程
[https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)