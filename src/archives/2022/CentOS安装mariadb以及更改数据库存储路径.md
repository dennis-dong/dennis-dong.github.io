---
title: CentOS安装mariadb以及更改数据库存储路径
description: CentOS安装mariadb以及更改数据库存储路径
date: 2022-05-16
category:
  - CentOS
tag:
  - MariaDB
---

<!-- more -->

**注意：此方法只适用于新机或可以卸载重装的机器，如需升级版本参考下方链接！！！**

 [https://www.jianshu.com/p/955ff6065935](https://www.jianshu.com/p/955ff6065935)

## 一、安装操作
### 1.查看是否已经安装mariadb
```sh
rpm -qa | grep -i mariadb
```

这是centos7.9默认自带的mariadb（MariaDB是MySql的一个分支，具体区别和关系自行查找文献）
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230414235337762-588563313.png)

### 2.卸载数据库
如果已安装的版本不是想要的版本，则卸载即可(*内容自行替换)
```sh
rpm -e --nodeps mariadb-libs-5.5.68-1.el7.x86_64
```

### 3.编辑数据库源配置
```sh
vi /etc/yum.repos.d/MariaDB.repo
```

按下`i`进入编辑模式，写入对应版本的配置信息，如`10.8`版本，对应版本参考官网说明 
[https://mariadb.org/download/?t=repo-config&d=CentOS+7&v=10.8&r_m=aliyun](https://mariadb.org/download/?t=repo-config&d=CentOS+7&v=10.8&r_m=aliyun)
```sh
# MariaDB 10.8 CentOS repository list - created 2023-04-14 08:39 UTC
# https://mariadb.org/download/
[mariadb]
name = MariaDB
# rpm.mariadb.org is a dynamic mirror if your preferred mirror goes offline. See https://mariadb.org/mirrorbits/ for details.
# baseurl = https://rpm.mariadb.org/10.8/centos/$releasever/$basearch
baseurl = https://mirrors.aliyun.com/mariadb/yum/10.8/centos/$releasever/$basearch
module_hotfixes = 1
# gpgkey = https://rpm.mariadb.org/RPM-GPG-KEY-MariaDB
gpgkey = https://mirrors.aliyun.com/mariadb/yum/RPM-GPG-KEY-MariaDB
gpgcheck = 1

```
然后按下`Esc`，输入`:wq`回车保存并退出

### 1.开始安装mariadb
```sh
yum install -y MariaDB-server MariaDB-client
```

### 2.启动服务
```sh
systemctl start mariadb
```

### 3.设置开机自启动服务
```sh
systemctl enable mariadb
```

### 4.查看服务运行状态
```sh
systemctl status mariadb
```

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230414164900705-2146753763.png)

这样就代表正常运行

## 二、配置操作
### 1.查看数据库版本
```sh
mariadb --version
```

### 2.配置数据库
```sh
mariadb-secure-installation
```

密码说明
```sh
# 输入数据库超级管理员root的密码(注意不是系统root的密码)，第一次进入还没有设置密码，所以直接回车
Enter current password for root (enter for none):
# 设置密码
Change the root password? [Y/n] y
# 密码
New password:
# 确认密码
Re-enter new password:
# 是否移除匿名用户
Remove anonymous users? [Y/n] y
# 是否拒绝root远程登录，不管y/n，都会拒绝root远程登录
Disallow root login remotely? [Y/n] n
# 是否删除test数据库，数据库中默认会有一个test数据库
Remove test database and access to it? [Y/n] y
# 重新加载权限表
Reload privilege tables now? [Y/n] y
```
PS: 这里设置密码**不生效**，需要后续登录后修改

### 3.连接数据库
由于未设置密码，直接回车即可

```sh
mariadb -u root -p
```

### 4.查看内置账号
```sql
select user, host from mysql.user;
```

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230414172131998-402411365.png)

### 5.账号设置
前面初始化时设置的root账号密码不生效，登录之后修改密码即可
```sql
ALTER USER `root`@`localhost` IDENTIFIED BY '密码';
```

授予root外网登陆权限（不建议），设置一个root的密码，只有使用该密码登录root账号时，才可以用于外网访问，roor本身只能本地登录
```sql
grant all privileges on *.* to root@'%' identified by '密码'; 
```

添加自定义帐号用于外网访问（建议）
```sql
grant all privileges on *.* to 账号名称@'%' identified by '密码'; 
```

**%表示针对所有IP，password表示将用这个密码登录root用户，如果想只让某个IP段的主机连接，可以修改为：**
```sql
GRANT ALL privileges ON *.* TO 'root'@'192.168.71.%' identified by 'my-new-password' with grant option;
```

### 6.刷新权限
更改完账号后必须要刷新权限，或者重启mariadb也可以
```sql
FLUSH PRIVILEGES;
```

再次查询用户之后，就会看到新的配置了
```sql
select user, host from mysql.user;
```

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230414172324647-1983950500.png)

### 7.退出
```sql
exit
```

### 8.端口设置
查看3306端口是否开启
```sh
firewall-cmd --query-port=3306/tcp
```

开启3306防火墙端口
```sh
firewall-cmd --zone=public --add-port=3306/tcp --permanent
```

开启后要重启防火墙
```sh
firewall-cmd --reload
```

这时候去尝试远程连接，如果连不了尝试关闭防火墙

停止防火墙
```sh
systemctl stop firewalld.service
```

禁止防火墙开机启动(视情况而定要不要设置这个)
```sh
systemctl disable firewalld.service
```

## 三、配置数据库编码格式
**查看默认编码格式和排序规则**
```sql
show variables like "%character%"; show variables like "%collation%";
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230414224525417-765455647.png)

**编码说明：**
> UTF-8是使用1~4个字节，一种变长的编码格式，字符编码。mb4即 most bytes 4，使用4个字节来表示完整的UTF-8。

> mysql的 utf8 编码最大字符长度为 3 字节，如果遇到 4 字节的宽字符就会插入异常了。三个字节的 UTF-8 最大能编码的 Unicode 字符是 0xffff，也就是 Unicode 中的基本多文种平面(BMP)。也就是说，任何不在基本多文本平面的 Unicode字符，都无法使用 Mysql 的 utf8 字符集存储。包括 Emoji 表情(Emoji 是一种特殊的 Unicode 编码，常见于 ios 和 android 手机上)，和很多不常用的汉字，以及任何新增的 Unicode 字符等等。

> 总结：MySQL的utf8是utfmb3，只有三个字节，节省空间但不能表达全部的UTF-8。所以推荐使用`utf8mb4`。

**排序规则说明：**
> `utf8mb4_bin`将字符串每个字符用二进制数据编译存储，区分大小写，而且可以存二进制的内容。

> `utf8mb4_general_ci`ci即case insensitive，不区分大小写。没有实现Unicode排序规则，在遇到某些特殊语言或者字符集，排序结果可能不一致。但是，在绝大多数情况下，这些特殊字符的顺序并不需要那么精确。
> `utf8_general_ci`：常规都支持，中文也是可以的，,检索速度快但是不是很准确

> `utf8mb4_unicode_ci`是基于标准的Unicode来排序和比较，能够在各种语言之间精确排序，Unicode排序规则为了能够处理特殊字符的情况，实现了略微复杂的排序算法。
> `utf8_unicode_ci`: 可以支持德语、西班牙语等,检索速度慢，但是很准确

> 总结：`utf8mb4_general_ci`是一个遗留的 校对规则，不支持扩展，它仅能够在字符之间进行逐个比较。`utf8_general_ci`校对规则进行的比较速度很快，但是与使用`utf8mb4_unicode_ci`的校对规则相比，比较正确性较差。
> `general_ci`更快，`unicode_ci`更准确。但相比现在的CPU来说，它远远不足以成为考虑性能的因素，索引涉及、SQL设计才是。使用者更应该关心字符集与排序规则在db里需要统一。（可能产生乱码的字段不要作为主键或唯一索引。例如：以 url 来作为唯一索引，但是它记录的有可能是乱码。）
> 综上，一般使用`utf8_general_ci`足够了，具体区别自行查找文献

### 1.配置server
```sh
vi /etc/my.cnf.d/server.cnf
```

在`[mysqld]`下添加
```sh
# 设置server相关编码和排序规则
character-set-server=utf8mb4
# 跳过连接参数，如 mariadb -u root -p --default-character-set=latin2
skip-character-set-client-handshake
```

### 2.配置client
```sh
vi /etc/my.cnf.d/mysql-clients.cnf
```

在`[mysql]`标签下添加
```sh
# 设置client相关编码和排序规则
default-character-set=utf8mb4
```

### 3.重启数据库
```sh
systemctl restart mariadb
```

### 4.查看设置后的编码
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230414225201736-1469588018.png)

### 5.修复现有数据库
更改编码后，建议修复一下现有数据库表的编码
```sh
mysqlcheck -u root -p --auto-repair --optimize --all-databases
```

## 四、配置大小写敏感(可忽略)
### 1.配置忽略表名大小写
```sh
vi /etc/my.cnf.d/server.cnf
```

在`[mysqld]`下添加
```sh
# 默认是等于0的,即大小写敏感。改成1就OK了。如果之前已经建了数据库要把之前建立的数据库删除，重建才生效。
lower_case_table_names=1 
```

### 2.重启数据库
```sh
systemctl restart mariadb
```

## 五、更改数据库默认存储路径
为什么要改呢？？？因为默认存储路径中内存使用率过高，防止内存溢出导致数据库运行异常

查看默认存储路径
```sql
show variables like "%datadir%";
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230415145757125-421782145.png)

### 1.停止服务
```sh
systemctl stop mariadb
```

### 2.迁移数据库
默认存储在`/var/lib/mysql`中，现把他迁移到`data`文件夹中
在根目录`/`下新建`data`文件夹
```
mkdir data
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230415142907044-848719491.png)

移动默认的`mysql`文件夹
```sh
mv /var/lib/mysql/ /data/mysql/
```

### 3.更改配置文件
```sh
vi /etc/my.cnf
```
在`[client-server]`下追加以下内容
```sh
socket=/data/mysql/mysql.sock
```

```
vi /etc/my.cnf.d/server.cnf
```
在`[mysqlld]`下追加以下内容
```sh
datadir=/data/mysql
```

### 4.重启服务
```sh
systemctl restart mariadb
```
重启可能会报错，按照提示执行命令查看报错信息，是因为没权限的原因，我们给文件夹提权
`Job for mariadb.service failed because the control process exited with error code. See "systemctl status mariadb.service" and "journalctl -xe" for details.`
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230415143711400-1206497088.png)

我们来赋权限
```sh
chown -R mysql:mysql /data/mysql/
```

再次重启即可
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230415144848702-318079424.png)

查看是否配置成功
```sql
show variables like '%datadir%';
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230415145007964-524636687.png)

### 5.Home路径问题
**PS：如果没报错，则忽略该步骤**
如果你路径改的是`home`下，这时候可能也会报错
 `Job for mariadb.service failed because the control process exited with error code. See "systemctl status mariadb.service" and "journalctl -xe" for details.`

运行命令找到`ProtectHome=true`改为`ProtectHome=false`
```sh
vi /usr/lib/systemd/system/mariadb.service
```

重新加载服务
```sh
systemctl daemon-reload
```

重启服务
```sh
systemctl restart mariadb
```

### 5.查看是否更改成功
查看存储路径
```sql
show variables like "%datadir%";
```

参考：
[https://www.cnblogs.com/yhongji/p/9783065.html](https://www.cnblogs.com/yhongji/p/9783065.html)
[https://www.cnblogs.com/macoffee/p/13743640.html](https://www.cnblogs.com/macoffee/p/13743640.html)
[https://www.jianshu.com/p/955ff6065935](https://www.jianshu.com/p/955ff6065935)
[https://segmentfault.com/a/1190000015324189](https://segmentfault.com/a/1190000015324189)