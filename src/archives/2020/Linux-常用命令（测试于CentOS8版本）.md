---
title: Linux 常用命令（测试于CentOS8版本）
date: 2020-08-24
category:
  - Linux
tag:
  - Linux
---

<!-- more -->

## 一、文件及文件夹操作

```sh
mkdir test   #创建文件夹  默认在Home/test
touch test.js #创建文件  默认Home/test.js  
touch test/test.js #创建文件  默认Home/test/test.js,必须先创建test文件夹
rm -fr test  #删除文件夹
rm -rf test/test.js #删除文件
vim test/test.js  #编辑文件，根据下面提示操作，编辑、覆盖还是删除操作
```

## 二、定时服务

```sh
crontab -e     #新建服务
*/1 * * * * /usr/bin/curl https://www.baidu.com     #定时每分钟访问URL
crontab -l      #查看本账户下的定时服务内容
service crond start            #启动服务
service crond stop            #关闭服务
service crond restart         #重启服务
service crond reload         #重新载入配置
service sshd status           #查看服务状态
```

**ps：命令规则说明**

### 定时服务命令规则
`* * * * * command`

 代表意义	分钟	  小时    日期    月份	 周	命令 
 数字范围	0~59      0~23    1~31    1~12	 0~7	命令 

```sh
* 12 * * * command   #代表任何时刻都接受的意思。日、月、周都是*，就代表着不论何月、何日的礼拜几的12：00都执行
0 3,6 * * * command  #每天的3:00和6:00 执行
0 8-12 * * * command  #每天的8:00至12:00 整点时刻都执行
*/5 * * * * command  #每间隔5分钟执行
```

`crontab [-u username] [-l|-e|-r]`
### 参数：
```sh
-u: 只有root才能进行这个任务，也即帮其他用户新建/删除crontab工作调度;
-e: 编辑crontab 的工作内容;
-l: 查阅crontab的工作内容;
-r: 删除所有的crontab的工作内容，若仅要删除一项，请用-e去编辑。
```

## 三、查看权限问题

```sh
su - root   #切换到root
chmod u+w /etc/sudoers   #添加sudoers编辑权限
vim /etc/audoers  #打开文件编辑
admin ALL=(ALL)  ALL   #添加所有权限
chmod u-w /etc/sudoers  #去除sudoers编辑权限
su - admin  #切换用户测试即可
```

## 四、查看crontab 定时服务日志

```sh
tail -f /var/log/cron.log #可能会提示权限不足 Permission denied，参考上面添加权限即可
service sshd status   #查看服务运行状态
```