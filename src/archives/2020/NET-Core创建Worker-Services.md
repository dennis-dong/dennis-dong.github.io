---
title: NET Core创建Worker Services
date: 2020-06-24
category:
  - Net
tag:
  - WindowsServices
---

<!-- more -->

## 前言

.NET CORE 3.0新增了Worker Services的新项目模板，可以编写长时间运行的后台服务，并且能轻松的部署成windows服务或linux守护程序。如果安装的vs2019是中文版本，Worker Services变成了辅助角色服务。Worker Services 咱也不知道怎么翻译成了这个名称，咱也不敢乱翻译，下文就保持原名称。。。，本文将会演示如何创建一个Worker Services项目，并且部署为windows服务或linux守护程序运行

## 创建 Worker Service 项目
### 1. 创建项目
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221204184939038-1752404372.png)

### 2. 项目结构
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221204185026831-1105731631.png)
项目创建成功之后，您会看到创建了两个类：Program和Worker

### 3. Program.cs
```csharp
public static void Main (string[] args) {
    CreateHostBuilder (args).Build ().Run ();
}

public static IHostBuilder CreateHostBuilder (string[] args) =>
    Host.CreateDefaultBuilder (args)
    .ConfigureServices ((hostContext, services) => {
        services.AddHostedService<Worker> ();
});
```
Program类跟ASP.NET Core Web应用程序非常类似，不同之处没有了startup类，并且把worker服务添加到DI container中

### 3. Worker.cs
```csharp
public class Worker : BackgroundService {
    private readonly ILogger<Worker> _logger;

    public Worker (ILogger<Worker> logger) {
        _logger = logger;
    }

    protected override async Task ExecuteAsync (CancellationToken stoppingToken) {
        while (!stoppingToken.IsCancellationRequested) {
            _logger.LogInformation ("Worker running at: {time}", DateTimeOffset.Now);
            await Task.Delay (1000, stoppingToken);
        }
    }
}

```
worker只是一个简单的类，它继承自BackgroundService ，而后者又实现IHostedService接口

### 4. 演示
默认的worker演示，每隔1秒，循环打印运行的时间
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221204185321822-339497393.png)

## 部署为Windows服务
### 1.安装依赖
在项目中添加nuget包：`Microsoft.Extensions.Hosting.WindowsServices`
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221204185441306-705485259.png)

### 2.使用依赖
在program.cs内部，将UseWindowsService()添加到CreateHostBuilder
```csharp
public static IHostBuilder CreateHostBuilder (string[] args) =>
    Host.CreateDefaultBuilder (args)
    .UseWindowsService ()
    .ConfigureServices ((hostContext, services) => {
        services.AddHostedService<Worker> ();
    });
```

### 3. 发布项目
`dotnet publish  -c Release -o C:\WorkerPub`

### 4. 管理服务
使用sc.exe工具来管理服务，输入一下命令创建为windows服务
`sc.exe create DemoWorkService binPath=C:\WorkerPub\WorkerService1.exe`

### 5. 查看服务状态
`sc.exe query DemoWorkService `

### 6. 启动服务
`sc.exe start DemoWorkService `
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221204185748277-1359348073.png)

### 7. 查看服务安装结果
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20221204185846697-2124041926.png)

### 8. 停用、删除服务
```
sc.exe stop DemoWorkService 
sc.exe delete DemoWorkService 
```

## 部署作为Linux守护程序运行
部署linux守护程序也是很方便的执行一下两个步骤即可：
1. 添加Microsoft.Extensions.Hosting.Systemd NuGet包到项目中，并告诉你的新Worker，其生命周期由systemd管理！
2. 将UseSystemd()添加到主机构建器中
```csharp
public static IHostBuilder CreateHostBuilder (string[] args) =>
    Host.CreateDefaultBuilder (args)
    .UseSystemd ()
    .ConfigureServices ((hostContext, services) => {
        services.AddHostedService<Worker> ();
    });
```

转载：[https://www.cnblogs.com/atree/p/netcore-worker-service.html](https://www.cnblogs.com/atree/p/netcore-worker-service.html)