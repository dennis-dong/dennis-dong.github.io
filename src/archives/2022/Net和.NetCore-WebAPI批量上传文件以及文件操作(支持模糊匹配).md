---
title: Net和.NetCore WebAPI批量上传文件以及文件操作(支持模糊匹配)
description: Net和.NetCore WebAPI批量上传文件以及文件操作(支持模糊匹配)
date: 2022-02-24
category:
  - Net
tag:
  - ES
---

<!-- more -->

## 1.Net

```csharp
/// <summary>
/// 上传文件
/// </summary>
/// <returns></returns>
[HttpPost]
public JsonResult ExportFile()
{
    UploadFile _uploadFile = new UploadFile();
    try
    {
        var file = Request.Files[0]; //获取选中文件
        string fileNameEx = Path.GetExtension(file.FileName);//获取扩展名
        string fileNameTrue = Path.GetFileNameWithoutExtension(file.FileName);// 获取文件名不含扩展名
        string imgType = Configs.GetValue("ImgType").ToUpper();

        if (file == null || string.IsNullOrEmpty(file.FileName) || file.ContentLength == 0)
        {
            _uploadFile.code = -1;
            _uploadFile.data = new { src = "" };
            _uploadFile.msg = "上传出错!未检测到文件";
            return Json(_uploadFile);
        }

        if (!imgType.Contains(fileNameEx.ToUpper().Replace(".", "")))
        {
            _uploadFile.code = -1;
            _uploadFile.data = new { src = "" };
            _uploadFile.msg = "上传出错!图片格式只支持"+ imgType;
            return Json(_uploadFile);
        }

        string filePathName = string.Empty;
        //定义本地路径位置
        string localPath = Server.MapPath("~/Upload/ArticleUploadImg/");
        string tmpName = Server.MapPath("~/Upload/ArticleUploadImg/");
        var tmp = file.FileName;
        var tmpIndex = 0;

        //判断是否存在相同文件名的文件 相同累加1继续判断  
        while (System.IO.File.Exists(tmpName + tmp))
        {
            tmp = fileNameTrue + "_" + ++tmpIndex + fileNameEx;
        }

        //不带路径的最终文件名  
        filePathName = tmp;

        if (!Directory.Exists(localPath))
            Directory.CreateDirectory(localPath);
        file.SaveAs(Path.Combine(tmpName, filePathName));   //保存图片（文件夹）  

        _uploadFile.code = 0;
        _uploadFile.data = new { src = Path.Combine("/Upload/ArticleUploadImg/", filePathName), title = Path.GetFileNameWithoutExtension(filePathName) };   
        _uploadFile.msg = "上传成功";
        return Json(_uploadFile);
    }
    catch (Exception ex)
    {
        return Json(_uploadFile, JsonRequestBehavior.AllowGet);
    }
}
```

## 2. NetCore
```csharp
/// <summary>
/// 文件上传
/// </summary>
/// <returns></returns>
[HttpPost, Route("attachment/Upload")]
public IHttpResponseResult UploadFile()
{
    const string logName = "UploadFile";

    try
    {
        var files = HttpContext.Current.Request.Files; //接收
        if (files.Count <= 0) return Fail(logName, "未获取到文件");

        for (var i = 0; i < files.Count; i++)
        {
            var file = files[i];
            if (file == null) continue;
            if (file.ContentLength > 1024 * 1024 * 5)
            {
                return Fail(logName, $"文件({file.FileName})大小超过5M", ErrorCode.FileTooLarge);
            }
        }

        var fileFolderId = Guid.NewGuid(); //重命名
        for (var i = 0; i < files.Count; i++)
        {
            var file = files[i];
            if (file == null) continue;

            var ext = Path.GetExtension(file.FileName).Replace(".", ""); //文件后缀名

            //判断是否是运行上传的图片格式
            if (Array.IndexOf(AppConfigs.FileType.Split('|'), ext) == -1)
            {
                return Fail(logName, $"({file.FileName})文件类型不支持", ErrorCode.FileTypeNotSupport);
            }

            var fileFolderPath = $"{HostingEnvironment.MapPath("/")}{AttachmentsBasePath}/{fileFolderId}/"; //重命名

            if (!Directory.Exists(fileFolderPath))
            {
                Directory.CreateDirectory(fileFolderPath);
            }

            var filePath = Path.Combine(fileFolderPath, file.FileName);
            file.SaveAs(filePath); //保存文件
        }

        return Success(logName, fileFolderId, "文件上传成功");
    }
    catch (Exception ex)
    {
        return Fail(logName, $"上传文件异常\n{ex.ToExceptionString()}");
    }
}
```

## 3.文件操作
```csharp
///<summary>
/// 文件操作帮助类
/// </summary>
public static class FileHelper
{
    /// <summary>
    /// 根目录
    /// </summary>
    private static readonly string RootPath = AppDomain.CurrentDomain.BaseDirectory;

    /// <summary>
    /// 读取文件夹下的文件
    /// </summary>
    /// <param name="fileFolderName">文件夹名称</param>
    /// <param name="path">根目录下的相对路径</param>
    /// <returns></returns>
    public static Dictionary<string, byte[]> ReadBatchFile(string fileFolderName, string path)
    {
        var fileDic = new Dictionary<string, byte[]>();
        var fileFolderPath = GetFolderPath(fileFolderName, path);
        if (fileFolderPath.IsNullOrEmpty())
        {
            return fileDic;
        }

        var filesPath = GetAllFiles(fileFolderPath);
        foreach (var filePath in filesPath)
        {
            var fileName = filePath.Split('\\').Last();
            fileDic.Add(fileName, File.ReadAllBytes(filePath));
        }

        return fileDic;
    }

    /// <summary>
    /// 删除文件夹
    /// </summary>
    /// <param name="fileFolderName">文件夹名称</param>
    /// <param name="path">根目录下的相对路径</param>
    /// <returns></returns>
    public static void DeleteDirectory(string fileFolderName, string path)
    {
        var fileFolderPath = GetFolderPath(fileFolderName, path);
        if (fileFolderPath.IsNullOrEmpty()) return;

        //先删除目录下的所有文件
        var filesPath = GetAllFiles(fileFolderPath);
        foreach (var filePath in filesPath)
        {
            File.Delete(filePath);
        }

        //再删除目录
        Directory.Delete(fileFolderPath);
    }

    /// <summary>
    /// 根据文件夹的相对路径获取绝对路径
    /// </summary>
    /// <param name="fileFolderName">文件夹名称</param>
    /// <param name="path">根目录下的相对路径</param>
    /// <returns></returns>
    private static string GetFolderPath(string fileFolderName, string path)
    {
        return Directory.GetDirectories($"{RootPath}/{path}", fileFolderName,
            SearchOption.TopDirectoryOnly).FirstOrDefault();
    }

    /// <summary>
    /// 获取文件路径下的所有文件
    /// </summary>
    /// <param name="fileFolderPath"></param>
    /// <returns></returns>
    private static IEnumerable<string> GetAllFiles(string fileFolderPath)
    {
        return Directory.GetFiles(fileFolderPath, "*");
    }

    /// <summary>
    /// 读取单个文件
    /// </summary>
    /// <param name="fileName"></param>
    /// <param name="path"></param>
    /// <returns></returns>
    public static byte[] ReadSingleFile(string fileName, string path)
    {
        var filePath = GetExactFilePath(fileName, path);
        return filePath.IsNullOrEmpty() ? null : File.ReadAllBytes(filePath);
    }

    /// <summary>
    /// 精确获取文件绝对路径(需要后缀名)
    /// </summary>
    /// <param name="fileName">文件名.后缀名</param>
    /// <param name="path">相对路径</param>
    /// <returns></returns>
    private static string GetExactFilePath(string fileName, string path)
    {
        return Directory.GetFiles($"{RootPath}/{path}", fileName, SearchOption.AllDirectories).FirstOrDefault();
    }

    /// <summary>
    /// 删除文件
    /// </summary>
    /// <param name="fileName">文件名称</param>
    /// <param name="path">根目录下的相对路径</param>
    /// <returns></returns>
    public static void DeleteFile(string fileName, string path)
    {
        var filePath = GetExactFilePath(fileName, path);
        if (!filePath.IsNullOrEmpty()) File.Delete(filePath);
    }

    /// <summary>
    /// 根据文件名片段模糊匹配获取文件路径
    /// </summary>
    /// <param name="fileName">文件名片段</param>
    /// <param name="path">相对路径</param>
    /// <returns></returns>
    public static string[] GetFuzzyFilePath(string fileName, string path)
    {
        return Directory.GetFiles($"{RootPath}/{path}", $"*{fileName}*.*", SearchOption.AllDirectories);
    }
}
```