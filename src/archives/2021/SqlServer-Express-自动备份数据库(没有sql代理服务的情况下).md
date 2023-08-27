---
title: SqlServer Express 自动备份数据库(没有sql代理服务的情况下)
description: SqlServer Express 自动备份数据库(没有sql代理服务的情况下)
date: 2021-10-26
category:
  - SQL
tag:
  - SQL Backup
---

<!-- more -->

## 一.注意

由于`Express`版本的`SQLServer`没有SQL代理服务（SQLSERVERAGENT），所以就不能通过`SQLServer作业`来进行自动备份了，那么我们可以用Windows计划任务来定时处理

## 二.操作方法
### 1.创建数据库脚本

```sql
DECLARE @backupTime VARCHAR(20)
DECLARE @fileName VARCHAR(1000)
SELECT @backupTime = (CONVERT(VARCHAR(8), GETDATE(), 112) +REPLACE(CONVERT(VARCHAR(5), GETDATE(), 114), ':', ''))
SELECT @fileName='F:\Database_Backup\DB_'+@backupTime+'.bak'
backup database DbName to disk=@fileName
```
**PS：**DbName 就是你要备份的数据库名称

### 2.创建一个bat批处理文件
`sqlcmd -S . -i F:\Database_Backup\backup.sql`
### 3.打开任务计划程序（左下角搜索Task）
### 4.右键创建基本任务
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211026171843741-2004058175.png)
### 5.设置定时启动时间，一路下一步
### 6.选择启动程序（之前创建的那个bat文件）
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211026172028925-1943524651.png)
### 7.完成，等待执行，你也可以自己手动执行一下，查看是否可以执行成功