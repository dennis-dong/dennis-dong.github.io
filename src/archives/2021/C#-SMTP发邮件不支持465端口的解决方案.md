---
title: C# SMTP发邮件不支持465端口的解决方案
date: 2021-07-10
category:
  - Net
tag:
  - SMTP
---

<!-- more -->

C# 发邮件帮助类传送门(465端口除外)： [https://www.dennisdong.top/archives/2022/C_发送邮件通知.html](https://www.dennisdong.top/archives/2022/C_发送邮件通知.html)

## 一、问题解惑，为什么465发送失败
查阅资料得知，.net 的自带组件`System.Net.Mail`发送邮件支持Explicit SSL但是不支持Implicit SSL，国内大部门邮件服务器都是Implicit SSL，所以无法通过465端口发邮件
有人说了，那干嘛要用呢，我用25不好好的么，为什么不用25呢？
这个问题问得好，很多云服务器像阿里、腾讯购买的新机都是把25端口封禁的，想要用25端口需要手动申请解封，据阿里工作客服所说，审核通过率极低
那么今天就记录一下如何使用465端口成功发邮件

## 二、解决方案
### 1. 可以使用CDO.Message发送邮件
如何引用CDO.Message？ cod.message的引用位置： `C:\Windows\System32\cdosys.dll`

```csharp
CDO.Message objMail = new CDO.Message();
try
{
objMail.To = "接收邮件账号";
objMail.From = "发送邮件账号";
objMail.Subject = "subject";//邮件主题string strHTML = @"";
strHTML = strHTML + "这里可以填写html内容";
objMail.HTMLBody = strHTML;//邮件内容
objMail.Configuration.Fields["http://schemas.microsoft.com/cdo/configuration/smtpserverport"].Value = 465;//设置端口
objMail.Configuration.Fields["http://schemas.microsoft.com/cdo/configuration/smtpserver"].Value = "smtp.qq.com";
objMail.Configuration.Fields["http://schemas.microsoft.com/cdo/configuration/sendemailaddress"].Value = "发送邮件账号";
objMail.Configuration.Fields["http://schemas.microsoft.com/cdo/configuration/smtpuserreplyemailaddress"].Value = "发送邮件账号";
objMail.Configuration.Fields["http://schemas.microsoft.com/cdo/configuration/smtpaccountname"].Value = "发送邮件账号";
objMail.Configuration.Fields["http://schemas.microsoft.com/cdo/configuration/sendusername"].Value = "发送邮件账号";
objMail.Configuration.Fields["http://schemas.microsoft.com/cdo/configuration/sendpassword"].Value = "发送邮件账号登录密码";
objMail.Configuration.Fields["http://schemas.microsoft.com/cdo/configuration/sendusing"].Value = 2;
objMail.Configuration.Fields["http://schemas.microsoft.com/cdo/configuration/smtpauthenticate"].Value = 1;
objMail.Configuration.Fields["http://schemas.microsoft.com/cdo/configuration/smtpusessl"].Value = "true";//这一句指示是否使用ssl
objMail.Configuration.Fields.Update();
objMail.Send();
}
catch (Exception ex) { throw ex; }
finally { }
System.Runtime.InteropServices.Marshal.ReleaseComObject(objMail);
objMail = null;
```
### 2. 使用`System.web.mail`发送邮件(仅适用于Web应用程序)

```csharp
System.Web.Mail.MailMessage mail = new System.Web.Mail.MailMessage();
try
{
mail.To = "收件人邮箱";
mail.From = "发件人邮箱";
mail.Subject = "subject";
mail.BodyFormat = System.Web.Mail.MailFormat.Html;
mail.Body = "body";
    
mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpauthenticate", "1"); //basic authentication
mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/sendusername", "发件人邮箱"); //set your username here
mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/sendpassword", "发件人邮箱密码"); //set your password here
mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpserverport", 465);//set port
mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpusessl", "true");//set is ssl
System.Web.Mail.SmtpMail.SmtpServer = "smtp.qq.com";
System.Web.Mail.SmtpMail.Send(mail);
//return true;
}
catch (Exception ex)
{
ex.ToString();
}
```
### 3. 使用 MailKit
需要NuGet两个包 `MimeKit、MailKit`

```csharp
using MailKit.Net.Smtp;
using MimeKit;
using System;
using System.IO;

public static void SendMailKit(string[] tos)
{
    var message = new MimeMessage();
    message.From.Add(new MailboxAddress("发件人名称", AppConfig.From));

    foreach (var s in tos)
    {
        if (!string.IsNullOrWhiteSpace(s))
        {
            message.To.Add(new MailboxAddress("收件人名称", s));
        }
    }

    message.Subject = "邮件标题";  //邮件标题
    var builder = new BodyBuilder
    {
        //TextBody = "Hey geffzhang<br>DennisDong"//不支持Html
        HtmlBody = "Hey geffzhang<br>DennisDong"//支持Html
    };

    //添加附件
    //builder.Attachments.Add($@"{Directory.GetCurrentDirectory()}\1.png");//包含图片附件，或者正文中有图片会被当成垃圾邮件退回，所以不建议放图片内容（跟Mail类库框架无关）
    builder.Attachments.Add($@"{Directory.GetCurrentDirectory()}\ConsoleApp1.exe.config");
    message.Body = builder.ToMessageBody();

    using (var client = new SmtpClient())
    {
        client.ServerCertificateValidationCallback = (s, c, h, e) => true;

        var mSendMail = "XXX@163.com";
        var mSendPwd = "XXXXX";//163和qq都是授权码，不是邮箱密码
        client.Connect("smtp.163.com", 465, true);//网易、QQ支持 25(未加密)，465和587(SSL加密）

        client.Authenticate(mSendMail, mSendPwd);

        try
        {
            client.Send(message);//发送邮件
            client.Disconnect(true);
        }
        catch (SmtpCommandException ex)
        {
            Console.WriteLine(ex.ErrorCode);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
```

### 4. 对比
比较推荐使用第三种 `MailKit`，如果使用的是QQ邮箱的话，C# 自带的`System.Net.Mail`类库也是可以的，端口写587就可以了，由于本人不喜欢使用QQ邮箱，所以提供了以上方法

参考文章：[https://www.cnblogs.com/tsql/p/9078163.html](https://www.cnblogs.com/tsql/p/9078163.html)