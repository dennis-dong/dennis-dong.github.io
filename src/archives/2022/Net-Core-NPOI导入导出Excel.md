---
title: Net Core NPOI导入导出Excel
description: Net Core NPOI导入导出Excel
date: 2022-03-11
category:
  - Net
tag:
  - Excel
  - NPOI
---

<!-- more -->

## 一、NuGet包

### 1. 安装NPOI和Npoi.Mapper

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220314114215017-1592817095.png)

## 二、Excel帮助类

```csharp
  /// <summary>
  /// Excel 操作帮助类
  /// </summary>
  public class ExcelHelper
  {
      /// <summary>
      /// List转Excel
      /// </summary>
      /// <typeparam name="T"></typeparam>
      /// <param name="list">数据</param>
      /// <param name="sheetName">表名</param>
      /// <param name="overwrite">true,覆盖单元格，false追加内容(list和创建的excel或excel模板)</param>
      /// <param name="xlsx">true-xlsx，false-xls</param>
      /// <returns>返回文件</returns>
      public static MemoryStream ParseListToExcel<T>(List<T> list, string? sheetName = null, bool overwrite = true, bool xlsx = true) where T : class
      {
          //这里的映射根据自己的Model定义，如果Model上的Column就是列名可以忽略
          var mapper = new Mapper()
              .Map<ContactImport>("姓", s => s.Surname)
              .Map<ContactImport>("中间名", s => s.MiddleName)
              .Map<ContactImport>("名", s => s.GivenName)
              .Map<ContactImport>("邮箱", s => s.EmailAddress1);
          MemoryStream ms = new MemoryStream();
          mapper.Save(ms, list, sheetName, overwrite, xlsx);
          return ms;
      }

      /// <summary>
      /// Excel转为List
      /// </summary>
      /// <typeparam name="T"></typeparam>
      /// <param name="fileStream"></param>
      /// <param name="sheetName"></param>
      /// <returns></returns>
      public static List<T> ParseExcelToList<T>(Stream fileStream, string? sheetName = null) where T : class
      {
          var mapper = new Mapper(fileStream);
          List<T> modelList = new List<T>();
          List<RowInfo<T>> dataList = sheetName.NotNullOrEmpty() ? mapper.Take<T>(sheetName).ToList() : mapper.Take<T>().ToList();

          if (dataList.Count <= 0) return modelList;

          modelList.AddRange(dataList.Select(item => item.Value));
          return modelList;
      }
  }
```

## 三、使用方法
### 1. 新建一个映射关系的Model类
PS：`Column`特性是`Npoi.Mapper`下的，即`using Npoi.Mapper.Attributes;`
    `Column`有重载，可以指定对应Excel中的列名或者对应索引(从0开始)

```csharp
public class ContactImport
{
    [Column(0)]
    public string Surname { get; set; }
    [Column(1)]
    public string MiddleName { get; set; }
    [Column(2)]
    public string GivenName { get; set; }
    [Column(3)]
    public string Initials { get; set; }
    [Column(4)]
    public string EmailAddress1 { get; set; }
}
```

### 2. 读取Excel数据并转换为List集合

```csharp
using var stream = file.OpenReadStream();
var dataList = ExcelHelper.ParseExcelToList<ContactImport>(stream);
```

### 3. 读取List集合并转换Excel文件流
```csharp
/// <summary>
/// 导出联系人
/// </summary>
/// <returns></returns>
[HttpGet("ExportContact")]
public ActionResult ExportContact()
{
    var dataList = new List<ContactImport>();
    for (int i = 1; i < 5; i++)
    {
        dataList.Add(new ContactImport
        {
            Surname = "张",
            MiddleName = "无",
            GivenName = $"忌{i}",
            Initials = $"zwj{i}",
            EmailAddress1 = $"zwj{i}@qq.com"
        });
    }

    var fileStream = ExcelHelper.ParseListToExcel(dataList);
    return File(fileStream.ToArray(), "application/vnd.ms-excel", "用户信息.xlsx");
}
```
参考：[https://www.cnblogs.com/wucy/p/14125392.html](https://www.cnblogs.com/wucy/p/14125392.html)