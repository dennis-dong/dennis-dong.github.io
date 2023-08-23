---
title: PostgresSQL 常用操作方法
date: 2020-08-05
category:
  - SQL
tag:
  - PgSql
---

<!-- more -->

### 1、后台生成XML作为参数然后数据库解析获取数据

```csharp
var idList = ids.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
var root = new XElement("xml");
if (idList.Length > 0)
{
    foreach (var id in idList)
    {
        var rightX = new XElement("item");
        rightX.SetAttributeValue("id", id);
        root.Add(rightX);
    }
}
string projectXml = root.ToString().Replace("<xml>", "<xml xmlns=\"xmlns\">");
```
pgsql中的pl/pgsql 使用不是很方便，后面加了xmlns属性是用来转换表格获取节点，官方文档是这样的。。
```sql
CREATE OR REPLACE FUNCTION public.fn_SchoolBotProjectSet(Schoolid TEXT,projectxml TEXT)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE
	_schoolid integer := schoolid;
	_projectxml XML := projectxml;
	r_count integer :=0;   
BEGIN
	IF _projectxml IS DOCUMENT THEN
--		-- 解析xml保存入表变量：项目
		CREATE TEMPORARY TABLE Project(
			Id CHAR(12) 
		);
	
		WITH xmldata(data) AS (VALUES (_projectxml::xml))
		
		INSERT INTO Project 
		SELECT xmltable.*
	  	FROM XMLTABLE(XMLNAMESPACES('xmlns' AS x),
	  				'/x:xml/x:item'
	                PASSING (SELECT data FROM xmldata)
	                COLUMNS id text PATH '@id');  
	               
	    IF NOT EXISTS (SELECT 1 FROM md_UserBotProject AS pro WHERE pro.SchoolId=_schoolid) THEN       
			INSERT INTO md_UserBotProject
			SELECT Project.Id, _schoolid,NULL
			FROM Project
			LEFT OUTER JOIN md_UserBotProject ON (md_UserBotProject.ProjectId = Project.Id);
	--		WHERE md_UserBotProject.ProjectId IS NULL;
			GET DIAGNOSTICS r_count := row_count; 				
		ELSE
			DELETE FROM md_UserBotProject AS pro WHERE pro.schoolid=_schoolid;
			INSERT INTO md_UserBotProject
			SELECT Project.Id, _schoolid,NULL
			FROM Project
			LEFT OUTER JOIN md_UserBotProject ON (md_UserBotProject.ProjectId = Project.Id);
			GET DIAGNOSTICS r_count := row_count;  --获取操作行数
		END IF;
	--		DROP TABLE Project; --最后需要DROP临时表
		IF r_count >0 THEN
			RETURN 1;
		ELSE 
			RETURN 0;  
		END IF;
	ELSE
		RETURN -1;
	END IF;    
END;
$function$
;
```

XML参数格式
```xml
<xml xmlns="xmlns">
<item id="5f303b8c0001" />
<item id="5f303b980002" />
</xml>
```

### 2、操作后返回自动增长列的值（增删改都可以，houseid为自动增长列）
```sql
DELETE FROM md_SchoolHouse WHERE houseid = 2 RETURNING houseid;
--md_bathmachine表名   machineid列名
_MachineId := (SELECT currval('md_bathmachine_machineid_seq'::regclass) AS id);
```

### 3、清空数据并初始化自动增长列1（student为表名）
```sql
--清空表数据
TRUNCATE student;
--清空表数据，自增从1开始
TRUNCATE student RESTART IDENTITY;
```

### 4、函数中获取操作行数，类似SQLServer中几行受影响
```sql
r_count integer :=0;   
GET DIAGNOSTICS r_count := row_count; 
```

### 5、函数中返回结果集（返回数据列要对应）
```sql
--返回类型改为实体表
RETURNS SETOF md_users
--返回查询结果
RETURN QUERY SELECT * FROM md_Users u WHERE u.userid = _userid;
返回类型也可以是自定义表（返回数据列要对应）
RETURNS TABLE(moneytotal numeric, counttotal bigint, persontotal bigint)
```

### 6、SQL拼接
```sql
SqlStr text;--声明变量
_Condition text;--声明变量
SqlStr:='SELECT aa ';
SqlStr:=SqlStr||',0.00 as CardTotal,0.00 as AppTotal FROM public.md_CashDeposit WHERE ' || _Condition  || ';';
return QUERY execute SqlStr;--返回类型为结果集时
```

### 7、关联更新数据
```sql
update public.md_BathMachine as bm set UBotId=rb.UBotId from public.md_SchoolRoomFloorBind as rb 
where bm.RoomFloorId=rb.RoomFloorId and rb.ProjectType=_ProjectType;
```

### 8、时间相关处理
```sql
SELECT NOW(); --2020-08-11 20:03:50
SELECT CURRENT_TIMESTAMP;--2020-08-11 20:03:59
SELECT CURRENT_TIME ;--20:04:10
SELECT CURRENT_DATE;--2020-08-11
SELECT NOW() + INTERVAL '10 year';--2030-08-11 20:05:52  min/year/month/day/hour/sec/
```

### 9、查询是如果为NULL时重新赋值，类似MSSQL中ISNULL
````sql
SELECT COALESCE(NULL,'123') != '13'
````

### 10、判断否个字段中是否包含否字符串，类似CHARINDEX(@Param,ColumnName)
```sql
SELECT distinct FloorNo,HouseId FROM public.v_SchoolRoomFloor WHERE POSITION('13000205F100001' IN UInstallId) >0 AND HouseId=1 AND Status=1;
SELECT distinct FloorNo,HouseId FROM public.v_SchoolRoomFloor WHERE STRPOS(UInstallId,'13000205F100001') >0 AND HouseId=1 AND Status=1;

--可查询多个
SELECT distinct FloorNo,HouseId FROM public.v_SchoolRoomFloor WHERE (STRING_TO_ARRAY('13000205F100001,1211212', ',') && STRING_TO_ARRAY(UInstallId, ','))
```

### 11、字段操作
```sql
ALTER TABLE public.md_bathnbonoffvalve ALTER COLUMN status SET DEFAULT '1'::integer;--修改字段
ALTER TABLE md_WattMachine ADD COLUMN IsAllowClose bool NOT NULL DEFAULT true;--添加字段
```

### 12、生成分页SQL语句
```csharp
public static string GetNpgSqlPagingSql(PageCriteria criteria)
{
    var sbSql = new StringBuilder();
    //效率比较慢
    sbSql.AppendFormat("select * from ( select row_number() over(order by {0}) as rowid,* from {1}) as subt \n", criteria.Sort, criteria.TableName);
    sbSql.AppendFormat("where subt.rowid>=({0}-1)*{1}+1 and subt.rowid<={0}*{1};\n", criteria.CurrentPage, criteria.PageSize);

    //PGSQL 自带OFFSET 功能，发现效率更高点
    var tableWhereStr = criteria.TableName;
    if (!string.IsNullOrEmpty(criteria.Condition))
    {
        tableWhereStr += " where " + criteria.Condition;
    }
            
    sbSql.AppendFormat("select (select count(1) from {0}) RecordCount,* from {0} order by {1} LIMIT {2} OFFSET {3}",
        tableWhereStr,
        criteria.Sort,
        criteria.PageSize,
        (criteria.CurrentPage - 1) * criteria.PageSize);

    return sbSql.ToString();
}

/// <summary>
/// 封装查询条件相关信息的类
/// </summary>
[Serializable]
public class PageCriteria
{
    public string TableName { get; set; }
    public string PrimaryKey { get; set; }
    public int PageSize { get; set; }
    public int CurrentPage { get; set; }
    public string Sort { get; set; }
    public string Condition { get; set; }
    /// <summary>
    /// 总行数
    /// </summary>
    public int RecordCount { get; set; }
}
```


### 13、获取时间部分
```sql
SELECT DATE_PART('hour',NOW());
SELECT DATE_PART('minute',NOW());
SELECT DATE_PART('second',NOW());
```

### 14、类型转换
```sql
SELECT cast('1234.33' as NUMERIC(18,2));
SELECT to_number('12121231231.8', '99999999999.99');
SELECT to_char(1234566.35, '99999999999');
SELECT to_number('1212.8', '99G999D9S');
SELECT to_number('12121231231.8', '99999999999.99');
SELECT replace('123456789', '456', '000');
```

### 15、数据库备份还原
```sh
BEGIN
找到数据库安装的bin目录，然后在此处打开cmd
备份数据库，指令如下：
pg_dump -h 164.82.233.54 -U postgres databasename > C:\databasename.bak
指令解释：如上命令，pg_dump 是备份数据库指令，164.82.233.54是数据库的ip地址（必须保证数据库允许外部访问的权限哦~）
当然本地的数据库ip写 localhost；postgres 是数据库的用户名；databasename 是数据库名。> 意思是导出到C:\databasename.bak文件里，
如果没有写路径，单单写databasename.bak文件名，那么备份文件会保存在C: \Program Files\PostgreSQL\9.0\bin 文件夹里。

恢复数据库，指令如下：  
psql -h localhost -U postgres -d databasename <  C:\databasename.bak
指令解释：如上命令，psql是恢复数据库命令，localhost是要恢复到哪个数据库的地址，当然你可以写上ip地址，也就是说能远程恢复（必须保证 数据库允许外部访问的权限哦~）；
postgres 就是要恢复到哪个数据库的用户；databasename 是要恢复到哪个数据库。<  的意思是把C:\databasename.bak文件导入到指定的数据库里。

在linux里依然有效。有一个值得注意的是：如果直接进入PostgreSQL的安装目录bin下，执行命令，可能会出现 找不到pg_dump，psql的现象，我们在可以这样：

备份：
/opt/PostgreSQL/9.5/bin/pg_dump -h 164.82.233.54 -U postgres databasename > databasename.bak
恢复： 
/opt/PostgreSQL/9.5/bin/psql -h localhost -U postgres -d databasename < databasename.bak
```


### 16、通过mac(某个字段)关联Update表数据
```sql
UPDATE md_WattMachine wmm 
SET WalletAmount=tt."data"*0.65
FROM (
SELECT wm.mac,wm.walletamount,wl."data" FROM md_WattMachine wm 
JOIN md_WattUseLog wl  ON wm.mac=wl.mac AND wl."time"='2020/9/1 13:00:00' 
) AS tt
WHERE wmm.mac = tt.mac;
```

### 17、数据库使用中无法删除解决办法
```sql
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE datname='testdb' AND pid<>pg_backend_pid();

testdb 为数据库名称，执行上面语句后再执行删除即可
使用数据库管理工具执行 DROP DATABASE testdb 时可能还是不行，所以用官方的PgAdmin  直接鼠标操作就可以了
```

### 18、变量赋值
```sql
DECLARE _botId TEXT := '';
SELECT s.ubotid INTO _botId FROM md_school s WHERE s.id=_schoolid;
```

### 19、游标使用
```sql
CREATE OR REPLACE FUNCTION public.fn_wattuselogtableadd(readingxml text)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE
	_readingxml XML := readingxml;--只是传进来没有用到，作为形参在程序中必须存在
	WattUseLog_Cursor CURSOR FOR SELECT id,time FROM public.ReadingTemp;

	r_result integer :=-2;-- -2电表未录入系统    1新增成功 
	r_count integer :=0;
	_tempid integer=0;
	_mac TEXT := '';
	_time timestamp := now();
BEGIN
	CREATE TEMPORARY TABLE OrderTemp(
		OrderId VARCHAR(18),
		SchoolId INT,
		SchoolName VARCHAR(50),
		AreaId INT,
		AreaName VARCHAR(50),
		HouseId INT,
		HouseName VARCHAR(50),
		FloorNo VARCHAR(20),
		RoomNo VARCHAR(20),
		UBotId CHAR(15),
		UInstallId CHAR(15),
		Mac VARCHAR(20),
		Rate DECIMAL(18,2),
		WattMultiple INT,
		LastData DECIMAL(18,2),
		cid VARCHAR(18),
		data DECIMAL(18,2),
		time timestamp,
		updtime timestamp,
		UsedData DECIMAL(18,2),
		UsedAmount DECIMAL(18,2)
	);
	
	IF EXISTS(SELECT 1 FROM ReadingTemp t JOIN md_WattMachine vm ON vm.Mac=t.id AND vm.Status>-1) THEN
		INSERT INTO OrderTemp 
		SELECT 
			t.OrderId
			,vm.SchoolId
			,vm.SchoolName
			,vm.AreaId
			,vm.AreaName
			,vm.HouseId
			,vm.HouseName
			,vm.FloorNo
			,vm.RoomNo
			,vm.UBotId
			,vm.UInstallId
			,t.id
			,vm.Rate --默认获取电表设置的费率
			,vm.WattMultiple
			,COALESCE(w.DATA,0) as data
			,t.cid
			,t.data
			,t.time
			,t.updtime
			,0 
			,0 
		FROM ReadingTemp t JOIN md_WattMachine vm ON vm.Mac=t.id AND vm.Status>-1
		LEFT JOIN (
			select Mac,data from (select row_number() over(partition by Mac order by time desc ) as keyId,Mac,data from md_WattUseLog) t where t.keyId =1
		) w ON vm.Mac=w.Mac;
		
		UPDATE OrderTemp SET UsedData=(data - LastData),UsedAmount=((data - LastData) * Rate * WattMultiple);
		
		
		-- 打开游标
		OPEN WattUseLog_Cursor;
		LOOP
--			-- 获取记录放入film
	      	FETCH WattUseLog_Cursor INTO _mac,_time;
	      	EXIT WHEN NOT FOUND;
  
	    	IF NOT EXISTS (SELECT 1 FROM md_WattUseLog WHERE mac=_mac AND "time"=_time) THEN 
	     		INSERT INTO md_WattUseLog(
	     		OrderId,SchoolId,SchoolName,AreaId,AreaName,HouseId,HouseName,FloorNo,RoomNo,UBotId,UInstallId,
	     		ProjectType,Mac,MacName,Rate,WattMultiple,cid,data,time,updtime,UsedData,UsedAmount,createtime) 
				SELECT 
				b.OrderId, b.SchoolId, b.SchoolName, b.AreaId, b.AreaName, b.HouseId, b.HouseName, b.FloorNo, b.RoomNo, 
				b.UBotId, b.UInstallId, 'watt' ProjectType ,b.Mac, '海兴' MacName, b.Rate,b.WattMultiple, b.cid, to_number(to_char(b.data, '99999999999.99'), '99999999999.99'), 
				b.time, b.updtime, b.UsedData, b.UsedAmount, now()
				FROM OrderTemp b WHERE b.Mac=_mac AND b.time=_time;
--				GET DIAGNOSTICS r_count := row_count;  --获取操作行数
				r_result := 1;  --新增成功
			ELSE
				r_result := -3;  --已有重复数据
	     	END IF;
		END LOOP;
--			IF r_count >0 THEN 
--				r_result := 1;  --新增成功
				
				--同步电表钱包余额 
				UPDATE md_WattMachine wm SET WalletAmount=(WalletAmount-orders.UsedAmount),UpdateTime=NOW() 
				FROM 
				(SELECT o.UsedAmount,o.mac FROM md_WattMachine m JOIN OrderTemp o ON o.Mac=m.Mac and m.Status >-1) AS orders
				WHERE wm.mac = orders.mac and wm.Status >-1;
				
				--同步消费单余额
				UPDATE md_WattUseLog wul SET WalletAmount=orders.WalletAmount 
				FROM 
				(SELECT wm.WalletAmount,wm.Mac,wm.Status,o.time FROM md_WattUseLog wl
				JOIN md_WattMachine wm ON wl.Mac=wm.Mac and wm.Status >-1 
				JOIN OrderTemp o on o.time=wl.time) AS orders
				WHERE wul.mac = orders.mac and wul.time=orders.time;
--			ELSE
--				r_result := 0;
--			END IF;
	
	END IF;

	CLOSE WattUseLog_Cursor;-- 关闭游标
--	DEALLOCATE WattUseLog_Cursor;  --PgSql没有此写法
	RETURN r_result;
END;
$function$
;
```