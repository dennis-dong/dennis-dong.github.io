---
title: Docker中apt-get update失败解决方案
date: 2022-10-29
category:
  - Docker
tag:
  - apt-get
---

<!-- more -->

## 一、更换apt的镜像源

### 1. 进入目录
`cd /etc/apt`

### 2. 备份源文件
`cp /etc/apt/sources.list /etc/apt/sources.list.bak`

### 3. 更改镜像源
```sh
cat <<EOF >/etc/apt/sources.list
deb http://mirrors.ustc.edu.cn/debian stable main contrib non-free
deb http://mirrors.ustc.edu.cn/debian stable-updates main contrib non-free
EOF
```

### 4. 执行更新命令
`apt-get update`
这个时候会报错，**The following signatures couldn't be verified because the public key is not available: NO_PUBKEY 648ACFD622F3D138 NO_PUBKEY 0E98404D386FA1D9 NO_PUBKEY 605C66F00D6C9793**

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221029003238605-978092477.png)

根据提示安装证书
```sh
apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 648ACFD622F3D138
```

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221029133350286-412864213.png)


### 5. 再次执行更新命令即可
警告不用理会

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221029003417653-288655723.png)