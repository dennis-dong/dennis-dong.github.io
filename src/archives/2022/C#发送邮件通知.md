---
title: C#发送邮件通知
description: C#发送邮件通知
date: 2022-03-02
category:
  - Net
tag:
  - SMTP
---

<!-- more -->

## 代码示例

```c#
/*-----------------------------------------------------------------
 * 作  者（Author）：             Dennis
 * 日  期（Create Date）：        2021/10/20 11:32:36
 * 公  司（Copyright）：          www.dennisdong.top
 * 文件名（File Name）：          SendEmailHelper
 * ----------------------------------------------------------------
 * 描  述（Description）：		  
 *----------------------------------------------------------------*/

using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;

namespace Anta.Common.Helpers
{
    /// <summary>
    /// 邮件发送帮助类
    /// </summary>
    public class SendEmailHelper
    {
        private static MailMessage _mailMessage;   //主要处理发送邮件的内容（如：收发人地址、标题、主体、图片等等）
        private static SmtpClient _mSmtpClient; //主要处理用smtp方式发送此邮件的配置信息（如：邮件服务器、发送端口号、验证方式等等）

        /// <summary>
        /// 邮件发送
        /// </summary>
        /// <param name="mailSetting">邮件配置</param>
        /// <param name="toEmailAddress">收件人地址</param>
        /// <param name="mailContent">邮件内容，支持HTML</param>
        /// <param name="attachmentsPath">附件的路径集合</param>
        public static void Send(MailSetting mailSetting, string[] toEmailAddress, string mailContent, List<string> attachmentsPath = null)
        {
            try
            {
                _mailMessage = new MailMessage();
                if (attachmentsPath != null)
                {
                    foreach (var t in attachmentsPath)
                    {
                        var data = new Attachment(t, MediaTypeNames.Application.Octet);
                        var disposition = data.ContentDisposition;
                        disposition.CreationDate = File.GetCreationTime(t);
                        disposition.ModificationDate = File.GetLastWriteTime(t);
                        disposition.ReadDate = File.GetLastAccessTime(t);

                        _mailMessage.Attachments.Add(data);
                    }
                }

                foreach (var s in toEmailAddress)
                {
                    if (!string.IsNullOrWhiteSpace(s))
                    {
                        _mailMessage.To.Add(s);
                    }
                }

                var mSendName = mailSetting.FromDisplay;
                var mSendPwd = mailSetting.FromPwd;
                var mSendAddress = mailSetting.From;
                _mailMessage.From = new MailAddress(mSendAddress, mSendName, Encoding.UTF8);
                _mailMessage.Subject = mailSetting.Subject;
                _mailMessage.Body = mailContent;
                _mailMessage.IsBodyHtml = true;
                _mailMessage.BodyEncoding = Encoding.UTF8;
                _mailMessage.Priority = MailPriority.Normal;

                _mSmtpClient = new SmtpClient
                {
                    Host = mailSetting.Host,
                    Port = mailSetting.Port,
                    UseDefaultCredentials = false,
                    EnableSsl = mailSetting.EnableSsl,
                    Credentials = new NetworkCredential(mSendAddress, mSendPwd),
                    DeliveryMethod = SmtpDeliveryMethod.Network
                };
                _mSmtpClient.Send(_mailMessage);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }

    /// <summary>
    /// 邮件发送配置
    /// </summary>
    public class MailSetting
    {
        /// <summary>
        /// 发件人邮箱
        /// </summary>
        public string From { get; set; }

        /// <summary>
        /// 发件人密码
        /// </summary>
        public string FromPwd { get; set; }

        /// <summary>
        /// 发件人描述名称
        /// </summary>
        public string FromDisplay { get; set; }

        /// <summary>
        /// 邮件主题名称
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// 邮件主机
        /// </summary>
        public string Host { get; set; }

        /// <summary>
        /// 主机端口号
        /// </summary>
        public int Port { get; set; }

        /// <summary>
        /// 是否启用SSL加密
        /// </summary>
        public bool EnableSsl { get; set; }
    }
}

```