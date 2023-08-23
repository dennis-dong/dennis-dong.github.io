---
title: EF Core DBFirst和CodeFirst 模式使用方法
date: 2021-08-02
category:
  - Net
tag:
  - CodeFirst
  - DBFirst
---

<!-- more -->

## 一、安装依赖包

### 1.Microsoft.EntityFrameworkCore

### 2.Microsoft.EntityFrameworkCore.Tools

### 3.Microsoft.EntityFrameworkCore.SqlServer

## 二、模式选择
### DBFirst 模式
#### 1.新建数据库脚本并执行

#### 2.打开程序包管理控制台生成DbContext上下文以及实体Model

`scaffold-dbcontext "server=.;database=dbfirst;uid=sa;pwd=123456;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models`

#### 3.配置Startup 类注册DbContext上下文

```csharp
services.AddDbContext<CodeFirstContext>(options =>
{
    options.UseSqlServer(Configuration.GetConnectionString("ConStr"));
});
```

#### 4.配置appsettings.json文件

```json
"ConnectionStrings": {
    "ConStr": "Server=localhost;Database=CodeFirst;Uid=sa;Pwd=Dennis374627149;"
  }
```

#### 5.Controller中依赖注入就可以使用了

```csharp
private readonly DbContextOptions<CodeFirstContext> _context;

public WeatherForecastController(ILogger<WeatherForecastController> logger, DbContextOptions<CodeFirstContext> context)
{
    _logger = logger;
    _context = context;
}

using (var context = new CodeFirstContext(_context))
{
    var model = context.UserEntities.FirstOrDefault(p => p.UserId.Equals("14"));
    if (model != null) return model.UpdateTime.ToString();
    return "";
}
```
### Code First 模式

#### 1.新建实体类Model

```csharp
[Table("Users")]
public class UserEntity
{
    [Key]
    [Required]
    [StringLength(32)]
    public string UserId { get; set; }

    [Required]
    [StringLength(20)]
    public string Name { get; set; }
    [StringLength(20)]
    public int Age { get; set; }
    [StringLength(11)]
    public string Tel { get; set; }
    [StringLength(11)]
    public DateTime Birthday { get; set; }

    [Required]
    public DateTime CreateTime { get; set; }
    [Required]
    public DateTime UpdateTime { get; set; } = DateTime.Now;
}
```
#### 2.新建DbContext上下文类，继承DbContext

```csharp
public class CodeFirstContext:DbContext
{
    public CodeFirstContext()
    {
    }
    public CodeFirstContext(DbContextOptions<CodeFirstContext> options) : base(options)
    {
    }
    public DbSet<UserEntity> UserEntities { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
    }
}
```
#### 3.Startup注入和appsettting.json文件同上

#### 4.打开程序包控制台（CodeFirstTest 自定义名称，如提示To undo this action, use Remove-Migration 代表初始化成功）

`Add-Migration CodeFirstTest `

#### 5.继续（更新最后一次迁移）

`update-database`

#### 6.迁移完成
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20210806114308207-1024911665.png)