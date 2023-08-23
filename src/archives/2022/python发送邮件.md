---
title: python发送邮件
date: 2022-09-22
category:
  - Python
tag:
  - SMTP
---

<!-- more -->

## 一、python 使用SMTP发送邮件通知

### 1. 运行环境

> python 3.6.8

### 2. 发送邮件类

```python
import smtplib
import traceback
from email.mime.text import MIMEText

class EmailSend(object):
    '''
    初始化邮件通知帮助类
    host: 主机
    port: 端口
    fromEmail: 发件人邮箱
    fromEmailPwd: 发件人邮箱密码
    toEmails: 收件人,以英文逗号(,)隔开
    isEnableSSL: 是否启用SSL加密
    '''

    def __init__(self, host: str, port: int, fromEmail: str, fromEmailPwd: str, toEmails: str, isEnableSSL: bool = False) -> None:
        self.host = host
        self.port = port
        self.fromEmail = fromEmail
        self.fromEmailPwd = fromEmailPwd
        self.toEmails = toEmails.split(',')
        self.isEnableSSL = isEnableSSL

    def send(self, subject, content):
        '''
        发送邮件
        subject: 邮件主题
        content: 邮件正文
        '''

        msg = MIMEText(content, 'plain', 'utf-8')
        msg['From'] = self.fromEmail
        msg['To'] = ','.join(self.toEmails)
        msg['Subject'] = subject
        try:
            if self.isEnableSSL:
                smtpobj = smtplib.SMTP_SSL(self.host)
            else:
                smtpobj = smtplib.SMTP(self.host)

            # 建立连接
            smtpobj.connect(self.host, self.port)
            # 登录
            smtpobj.login(self.fromEmail, self.fromEmailPwd)
            # 发送邮件
            smtpobj.sendmail(self.fromEmail, self.toEmails, msg.as_string())
            return True, None
        except:
            return False, str(traceback.format_exc())
        finally:
            smtpobj.quit()
```

### 3. 测试结果

```python
def sendEmailTest():
    host = 'smtp.163.com'
    port = 465
    fromEmail = 'XXXX@163.com'
    portPwd = 'XXXXXXXXX' # 网易和QQ使用的是授权码
    toEmails = 'user1@163.com,user2@163.com'
    emailHelper = EmailSend(host, port, fromEmail, portPwd, toEmails, True)
    emailHelper.send('邮件测试主题', '这是一封测试邮件')
    
{True, None}
```