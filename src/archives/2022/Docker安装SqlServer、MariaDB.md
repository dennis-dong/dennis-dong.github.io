---
title: Docker安装SqlServer、MariaDB
description: Docker安装SqlServer、MariaDB
date: 2022-10-29
category:
  - Docker
tag:
  - SqlServer
  - MySql
  - MariaDB
---

<!-- more -->

## 一、Docker 安装SqlServer 说明

### 1. 拉取镜像
```sh
docker pull mcr.microsoft.com/mssql/server:2019-latest
```

### 2.运行
```sh
docker run --name mssqlserver_2019 -d --restart unless-stopped -e "ACCEPT_EULA=Y" -p 1433:1433 -e TZ="Asia/Shanghai" -e "MSSQL_SA_PASSWORD=1234.com" mcr.microsoft.com/mssql/server:2019-latest
```
### 3.连接
可以使用官方的SSMS工具连接或者第三方管理工具连接，账号为`sa`，密码为`1234.com`

**PS：官方文档**
[Docker: Install containers for SQL Server on Linux - SQL Server](https://learn.microsoft.com/zh-cn/sql/linux/quickstart-install-connect-docker?view=sql-server-ver16&pivots=cs1-bash)

## 二、Docker 安装MariaDB 说明
### 1. 拉取镜像
```sh
docker pull mariadb:10.8
```

### 2.运行
```sh
docker run --name mariadb_10.8 -d --restart unless-stopped -p 3306:3306 -e TZ="Asia/Shanghai" -e MYSQL_ROOT_PASSWORD=1234.com mariadb:10.8
```

**PS：官方文档**
[Installing and Using MariaDB via Docker](https://mariadb.com/kb/en/installing-and-using-mariadb-via-docker/)


### 3.账号管理
#### 3.1 登录数据库
```sh
mariadb -u root -p
```
输入初始密码`1234.com`回车即可

#### 3.2 查看内置账号
```
select user,host,password from mysql.user;
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230415004107399-1645471304.png)

> 这里Host为`localhost`的root是只允许本地登录的，Host为`%`的是可以外部连接登录的
> `不建议`直接使用root账号外部登录，所以我们把%的这个删掉
> `建议`新添加一个账号提供给外部使用

#### 3.3 删除外部登录的root账号
```sql
delete from mysql.user where user='root' and host='%'; flush privileges;
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230415005214223-1974094249.png)

#### 3.4 添加外部账号
```sql
grant all privileges on *.* to dennis@'%' identified by 'dennis'; flush privileges;
```

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230415005418976-695916668.png)

**也可以添加ip网段限制**
```sql
GRANT ALL privileges ON *.* TO 'dennis'@'192.168.71.%' identified by 'my-new-password' with grant option; flush privileges;
```

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230415005946965-130695349.png)


### 4.更改编码格式（可忽略）
> `可选操作，更改编码格式等`
> 如更改数据库编码格式和排序规则等。。。
> 可参考另一篇文章 [https://www.dennisdong.top/archives/2022/CentOS安装mariadb以及更改数据库存储路径.html](https://www.dennisdong.top/archives/2022/CentOS安装mariadb以及更改数据库存储路径.html)
> 默认的编码格式是`utf8mb3`，我们需要更改为`utf8mb4`，具体什么区别，上面文章中有讲到

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230415013057353-1953135197.png)

#### 4.1 查找mysql配置
查看所有已运行的容器
```sh
docker ps
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230415010208311-850178438.png)

进入docker镜像内部的`etc`文件夹
```sh
docker exec -it 你的镜像ID bash
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230415010516803-453501907.png)

查看配置文件
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230415010947188-1011359283.png)

> 这两个文件的内容是一模一样的，也有对各个文件的说明，我们只需要改`mariadb.conf.d`的配置即可，全局配置不用更改

#### 4.2 进入配置文件夹
```sh
cd mariadb.conf.d/
ls
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230415150654110-1514938731.png)

#### 4.3 查看配置文件
```sh
cat 50-server.cnf
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230415011635374-728731409.png)

> 需要更改的配置在`mysqld`标记下面添加即可

#### 4.4 更改配置文件
```sh
vim 50-server.cnf
```
此时会报错，`vim: command not found`，需要安装`vim`

```sh
apt-get install vim
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230415013649391-1935791009.png)


需要更新`apt-get`
```sh
apt-get update
```

如果无法更新，需要替换apt-get镜像源
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221029122011518-1995539175.png)

更改镜像源参考文章 [https://www.dennisdong.top/archives/2022/Docker中apt-get-update失败解决方案.html](https://www.dennisdong.top/archives/2022/Docker中apt-get-update失败解决方案.html)

更改完成之后再次安装输入y即可
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221029123346203-1410929519.png)

重新执行
```sh
vim 50-server.cnf
```

复制内容到`mysqld`下
```sql
# 设置server相关编码和排序规则
character-set-server=utf8mb4
# 跳过连接参数，如 mariadb -u root -p --default-character-set=latin2
skip-character-set-client-handshake
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230415015116290-158722710.png)

如果鼠标右键无法直接粘贴进去，查了很多方法说更改`vim`中`default.vim`以及安装`vim-scripts,vim=gtk`等都没用，直接使用`shift + insert`快捷键即可

**更改完需要重启mariadb镜像**

#### 4.5 重启镜像查看配置
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230415014425199-859385764.png)