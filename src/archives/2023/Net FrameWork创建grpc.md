---
title: Net FrameWork创建grpc
description: Net FrameWork创建grpc
date: 2023-02-14
category:
  - .Net
tag:
  - .Net
  - Grpc
---

<!-- more -->

## 1.环境要求

`.Net Framework 4.8`

`.Net Core 版本：` [https://www.dennisdong.top/archives/2023/Net%20Core(.Net6)创建grpc.html](https://www.dennisdong.top/archives/2023/Net%20Core(.Net6)创建grpc.html)

## 2.Stub和Proto
### 2.1 新建类库
`GrpcCommon`

### 2.2 新建文件夹和配置文件
文件夹：`Certs`,`Helpers`,`Models`,`Protos\Google`,`Stubs\Example`
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230214164802634-261918084.png)

class类：`AppConfigs.cs`
```csharp
using System;
using System.Configuration;

namespace GrpcCommon
{
    public class AppConfigs
    {
        public static string Host = GetValue("host");
        public static int HttpPort = Convert.ToInt32(GetValue("httpPort"));
        public static int HttpsPort = Convert.ToInt32(GetValue("httpsPort"));
        public static string Issuer = GetValue("issuer");
        public static int Expire = Convert.ToInt32(GetValue("expire"));
        public static string SecurityKey = GetValue("securityKey");


        public static string GetValue(string key)
        {
            try
            {
                return ConfigurationManager.AppSettings[key].Trim();
            }
            catch (Exception e)
            {
                throw new Exception($"AppConfig 配置获取异常,{e.StackTrace}");
            }
        }

        public static T GetValue<T>(string key) where T : class
        {
            try
            {
                return ConfigurationManager.AppSettings[key].Trim() as T;
            }
            catch (Exception e)
            {
                throw new Exception($"AppConfig 配置获取异常,{e.StackTrace}");
            }
        }
    }
}

```
添加程序集引用：`System.Configuration`
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230214195300673-2072536785.png)


### 2.3 新建proto文件
在`Protos`下新建`example.proto`文件
```csharp
syntax = "proto3";

package example;
import "Protos/Google/struct.proto";

option csharp_namespace = "GrpcExample";

service ExampleServer {
	// Unary
	rpc UnaryCall (ExampleRequest) returns (ExampleResponse);

	// Server streaming
	rpc StreamingFromServer (ExampleRequest) returns (stream ExampleResponse);

	// Client streaming
	rpc StreamingFromClient (stream ExampleRequest) returns (ExampleResponse);

	// Bi-directional streaming
	rpc StreamingBothWays (stream ExampleRequest) returns (stream ExampleResponse);
}

message ExampleRequest {
	string securityKey = 1;
	string userId = 2;
	google.protobuf.Struct userDetail = 3;
	string token = 4;
}

message ExampleResponse {
	int32 code = 1;
	bool result = 2;
	string message = 3;
}
```
### 2.4 下载google protobuf文件
[https://github.com/protocolbuffers/protobuf/releases/download/v21.12/protoc-21.12-win64.zip](https://github.com/protocolbuffers/protobuf/releases/download/v21.12/protoc-21.12-win64.zip)
其他版本参考：[https://github.com/protocolbuffers/protobuf/releases](https://github.com/protocolbuffers/protobuf/releases)
**下载不了的**文章末尾有**源码**地址

下载解压后将`\include\google\protobuf`中的所有文件放在`Protos`下的`Google`中
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230214164847835-1891168737.png)

### 2.5 NuGet安装依赖包
`GrpcCommon`右键`管理NuGet程序包`安装以下依赖：
`Google.Protobuf 3.21.12`,`Grpc.Core 2.46.6`,`Grpc.Tools 2.51.0`,`JWT 10.0.2`
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230214195511536-294383971.png)

### 2.6 生成stub文件
项目根目录下按下`Shift`+鼠标右键在此打开命令窗口
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230214173009894-182599825.png)

```sh
.\packages\Grpc.Tools.2.51.0\tools\windows_x64\protoc.exe -I .\GrpcCommon\ .\GrpcCommon\Protos\example.proto --csharp_out .\GrpcCommon\Stubs\Example --grpc_out .\GrpcCommon\Stubs\Example --plugin=protoc-gen-grpc=.\packages\Grpc.Tools.2.51.0\tools\windows_x64\grpc_csharp_plugin.exe
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230214173137720-984798555.png)

运行之后会在`Example`文件夹下生成`Example.cs`和`ExampleGrpc.cs`
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230214165058898-1549781717.png)

### 2.7 配置JWT
#### 2.7.1 在`Models`下新建`JwtToken`
```csharp
/// <summary>
    /// Jwt Token
    /// </summary>
    public class JwtToken
    {
        /// <summary>
        /// 授权者
        /// </summary>
        public string userid { get; set; }

        /// <summary>
        /// Token过期时间
        /// </summary>
        public long exp { get; set; }

        /// <summary>
        /// Issuer
        /// </summary>
        public string iss { get; set; }
    }
```
#### 2.7.2 在`Models`下新建`UserDetails`
```csharp
public class UserDetails
    {
        public string UserName { get; set; }
        public int Age { get; set; }
        public IEnumerable<string> Friends { get; set; }
    }
```

#### 2.7.2 在`Helpers`下新建`JwtHelper`
```csharp
using System;
using System.Text;
using GrpcCommon.Models;
using JWT;
using JWT.Algorithms;
using JWT.Exceptions;
using JWT.Serializers;

#pragma warning disable CS0618

namespace GrpcCommon.Helpers
{
    public class JwtHelper
    {
        /// <summary>
        /// 颁发JWT Token
        /// </summary>
        /// <param name="securityKey"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public static string GenerateJwt(string securityKey, string userName)
        {
            //var securityKey = AppConfigs.SecurityKey;
            var issuer = AppConfigs.Issuer;
            var expire = AppConfigs.Expire;
            var expTime = new DateTimeOffset(DateTime.Now.AddSeconds(expire)).ToUnixTimeSeconds();

            //身份验证信息
            var jwtToken = new JwtToken { userid = userName, exp = expTime, iss = issuer };
            var key = Encoding.UTF8.GetBytes(securityKey);
            IJwtAlgorithm algorithm = new HMACSHA256Algorithm(); //加密方式
            IJsonSerializer serializer = new JsonNetSerializer(); //序列化Json
            IBase64UrlEncoder urlEncoder = new JwtBase64UrlEncoder(); //base64加解密
            IJwtEncoder encoder = new JwtEncoder(algorithm, serializer, urlEncoder); //JWT编码
            var token = encoder.Encode(jwtToken, key); //生成令牌

            return token;
        }

        /// <summary>
        /// 校验解析Jwt Token
        /// </summary>
        /// <returns></returns>
        public static Tuple<bool, string> ValidateJwt(string token, string secret)
        {
            try
            {
                IJsonSerializer serializer = new JsonNetSerializer();
                IDateTimeProvider provider = new UtcDateTimeProvider();
                IJwtValidator validator = new JwtValidator(serializer, provider);
                IBase64UrlEncoder urlEncoder = new JwtBase64UrlEncoder();
                IJwtAlgorithm alg = new HMACSHA256Algorithm();
                IJwtDecoder decoder = new JwtDecoder(serializer, validator, urlEncoder, alg);
                var payLoad = decoder.Decode(token, secret);

                //校验通过，返回解密后的字符串
                return new Tuple<bool, string>(true, payLoad);
            }
            catch (TokenExpiredException expired)
            {
                //token过期
                return new Tuple<bool, string>(false, expired.Message);
            }
            catch (SignatureVerificationException sve)
            {
                //签名无效
                return new Tuple<bool, string>(false, sve.Message);
            }
            catch (Exception err)
            {
                // 解析出错
                Console.WriteLine(err.StackTrace);
                return new Tuple<bool, string>(false, err.Message);
            }
        }
    }
}

```

## 3.搭建grpc服务端
### 3.1 新建控制台应用程序
`GrpcServer`
### 3.2 安装依赖包
`Google.Protobuf 3.21.12`,`Grpc.Core 2.46.6`,`Newtonsoft.Json 13.0.2`
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230214200224724-174533823.png)

### 3.3 新建服务类
`ExampleService.cs`
```csharp
using System;
using System.Threading.Tasks;
using Grpc.Core;
using GrpcCommon.Helpers;
using GrpcCommon.Models;
using GrpcExample;
using Newtonsoft.Json;

namespace GrpcServer.Services
{
    public class ExampleService : ExampleServer.ExampleServerBase
    {
        public override Task<ExampleResponse> UnaryCall(ExampleRequest request, ServerCallContext context)
        {
            Console.WriteLine(request.ToString());
            var tokenRes = JwtHelper.ValidateJwt(request.Token, request.SecurityKey);

            // 正常响应客户端一次
            ExampleResponse result;

            if (tokenRes.Item1)
            {
                var payLoad = JsonConvert.DeserializeObject<JwtToken>(tokenRes.Item2);

                if (!request.UserId.Equals(payLoad.userid))
                {
                    result = new ExampleResponse
                    {
                        Code = -1,
                        Result = false,
                        Message = "userid不匹配"
                    };
                }
                else
                {
                    var userDetail = JsonConvert.DeserializeObject<UserDetails>(request.UserDetail.Fields.ToString());
                    result = new ExampleResponse
                    {
                        Code = 200,
                        Result = true,
                        Message = $"UnaryCall 单次响应: {request.UserId},{userDetail.UserName}"
                    };
                }
            }
            else
            {
                // 正常响应客户端一次
                result = new ExampleResponse
                {
                    Code = -1,
                    Result = false,
                    Message = tokenRes.Item2
                };
            }
            return Task.FromResult(result);
        }

        public override async Task StreamingFromServer(ExampleRequest request, IServerStreamWriter<ExampleResponse> responseStream, ServerCallContext context)
        {
            // 无限响应客户端
            while (!context.CancellationToken.IsCancellationRequested)
            {
                await responseStream.WriteAsync(new ExampleResponse
                {
                    Code = 200,
                    Result = true,
                    Message = $"StreamingFromServer 无限响应: {Guid.NewGuid()}"
                });
                await Task.Delay(TimeSpan.FromSeconds(3), context.CancellationToken);
            }
        }

        public override async Task<ExampleResponse> StreamingFromClient(IAsyncStreamReader<ExampleRequest> requestStream, ServerCallContext context)
        {
            // 处理请求
            while (await requestStream.MoveNext())
            {
                Console.WriteLine(requestStream.Current.UserId);
            }

            // 响应客户端
            return new ExampleResponse
            {
                Code = 200,
                Result = true,
                Message = $"StreamingFromClient 单次响应: {Guid.NewGuid()}"
            };
        }

        public override async Task StreamingBothWays(IAsyncStreamReader<ExampleRequest> requestStream, IServerStreamWriter<ExampleResponse> responseStream, ServerCallContext context)
        {
            #region 服务器响应客户端一次

            // 处理请求
            //while (await requestStream.MoveNext())
            //{
            //    Console.WriteLine(requestStream.Current.UserName);
            //}

            //请求处理完成之后只响应一次
            //await responseStream.WriteAsync(new ExampleResponse
            //{
            //    Code = 200,
            //    Result = true,
            //    Message = $"StreamingBothWays 单次响应: {Guid.NewGuid()}"
            //});
            //await Task.Delay(TimeSpan.FromSeconds(3), context.CancellationToken);

            #endregion

            #region 服务器响应客户端多次

            // 处理请求
            var readTask = Task.Run(async () =>
            {
                while (await requestStream.MoveNext())
                {
                    Console.WriteLine(requestStream.Current.UserId);
                }
            });

            // 请求未处理完之前一直响应
            while (!readTask.IsCompleted)
            {
                await responseStream.WriteAsync(new ExampleResponse
                {
                    Code = 200,
                    Result = true,
                    Message = $"StreamingBothWays 请求处理完之前的响应: {Guid.NewGuid()}"
                });
                await Task.Delay(TimeSpan.FromSeconds(3), context.CancellationToken);
            }

            // 也可以无限响应客户端
            //while (!context.CancellationToken.IsCancellationRequested)
            //{
            //    await responseStream.WriteAsync(new ExampleResponse
            //    {
            //        Code = 200,
            //        Result = true,
            //        Message = $"StreamingFromServer 无限响应: {Guid.NewGuid()}"
            //    });
            //    await Task.Delay(TimeSpan.FromSeconds(3), context.CancellationToken);
            //}

            #endregion
        }
    }
}

```
### 3.4 AppConfig添加配置
```xml
<appSettings>
	<!--主机配置-->
	<add key="host" value="0.0.0.0" />
	<add key="httpPort" value="5000" />
	<add key="httpsPort" value="7000" />
	<!--Jwt配置-->
	<add key="securityKey" value="grpc.dennis.com" />
	<add key="issuer" value="https://grpc.dennis.com" />
	<!--token过期时间：分钟-->
	<add key="expire" value="1" />
</appSettings>
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230214171343115-132128737.png)

### 3.5 修改程序入口
修改`Program.cs`，SSL证书文章后面有说明
```csharp
using System;
using Grpc.Core;
using System.Collections.Generic;
using System.IO;
using GrpcCommon;
using GrpcExample;
using GrpcServer.Services;

private static void Main()
        {
            var host = AppConfigs.Host;
            var httpPort = AppConfigs.HttpPort;
            var httpsPort = AppConfigs.HttpsPort;
            var cert = File.ReadAllText("Certs\\cert.pem");
            var key = File.ReadAllText("Certs\\key.pem");
            var server = new Server
            {
                Services =
                {
                    ExampleServer.BindService(new ExampleService())
                },
                Ports =
                {
                    new ServerPort(host, Convert.ToInt32(httpPort), ServerCredentials.Insecure),
                    new ServerPort(host, Convert.ToInt32(httpsPort), new SslServerCredentials(
                        new List<KeyCertificatePair>
                        {
                            new KeyCertificatePair(cert, key)
                        }))
                }
            };
            server.Start();

            Console.WriteLine($"Grpc Server Listening on http://{host}:{httpPort}, https://{host}:{httpsPort}");
            Console.ReadLine();

            server.ShutdownAsync().Wait();
        }
```

## 4.搭建grpc客户端
### 4.1 新建控制台应用程序
`GrpcClient`
### 4.2 安装依赖包
`Google.Protobuf 3.21.12`,`Grpc.Core 2.46.6`,`Newtonsoft.Json 13.0.2`
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230214200516738-225520618.png)

### 4.3 新建测试类
`ExampleUnit.cs`
```csharp
using System;
using Google.Protobuf.WellKnownTypes;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Grpc.Core;
using GrpcExample;
using GrpcCommon.Helpers;

namespace GrpcClient.Test
{
    internal class ExampleUnit
    {
        public static void Run()
        {
            // 常规请求响应
            UnaryCall();

            // 服务器流响应
            StreamingFromServer();

            // 客户端流响应
            StreamingFromClient();

            // 双向流响应
            StreamingBothWays();
        }

        /// <summary>
        /// 创建客户端链接
        /// </summary>
        /// <param name="enableSsl"></param>
        /// <returns></returns>
        private static ExampleServer.ExampleServerClient CreateClient(bool enableSsl = true)
        {
            Channel channel;
            if (enableSsl)
            {
                // ssl加密连接
                const string serverUrl = "localhost:7000";
                Console.WriteLine($"尝试链接服务器,https://{serverUrl}");
                var credentials = new SslCredentials(File.ReadAllText("Certs\\cert.pem"));
                channel = new Channel(serverUrl, credentials, new List<ChannelOption>
                {
                    new ChannelOption(ChannelOptions.SslTargetNameOverride, "grpc.dennis.com")
                });
            }
            else
            {
                // 不安全连接
                const string serverUrl = "localhost:5000";
                Console.WriteLine($"尝试链接服务器,http://{serverUrl}");
                channel = new Channel(serverUrl, ChannelCredentials.Insecure);
            }

            Console.WriteLine("服务器链接成功");
            return new ExampleServer.ExampleServerClient(channel);
        }

        private static async void UnaryCall()
        {
            var client = CreateClient();
            var userId = Guid.NewGuid().ToString();
            const string securityKey = "Dennis!@#$%^";
            var token = JwtHelper.GenerateJwt(securityKey, userId);

            var result = await client.UnaryCallAsync(new ExampleRequest
            {
                SecurityKey = securityKey,
                UserId = userId,
                UserDetail = new Struct
                {
                    Fields =
                    {
                        ["userName"] = Value.ForString("Dennis"),
                        ["age"] = Value.ForString("18"),
                        ["friends"] = Value.ForList(Value.ForString("Roger"), Value.ForString("YueBe"))
                    }
                },
                Token = token
            });
            Console.WriteLine($"Code={result.Code},Result={result.Result},Message={result.Message}");
        }

        private static async void StreamingFromServer()
        {
            var client = CreateClient();
            var result = client.StreamingFromServer(new ExampleRequest
            {
                UserId = "Dennis"
            });

            while (await result.ResponseStream.MoveNext())
            {
                var resp = result.ResponseStream.Current;
                Console.WriteLine($"Code={resp.Code},Result={resp.Result},Message={resp.Message}");
            }
        }

        private static async void StreamingFromClient()
        {
            var client = CreateClient();
            var result = client.StreamingFromClient();

            // 发送请求
            for (var i = 0; i < 5; i++)
            {
                await result.RequestStream.WriteAsync(new ExampleRequest
                {
                    UserId = $"StreamingFromClient 第{i}次请求"
                });
                await Task.Delay(TimeSpan.FromSeconds(1));
            }

            // 等待请求发送完毕
            await result.RequestStream.CompleteAsync();

            var resp = result.ResponseAsync.Result;
            Console.WriteLine($"Code={resp.Code},Result={resp.Result},Message={resp.Message}");
        }

        private static async void StreamingBothWays()
        {
            var client = CreateClient();
            var result = client.StreamingBothWays();

            // 发送请求
            for (var i = 0; i < 5; i++)
            {
                await result.RequestStream.WriteAsync(new ExampleRequest
                {
                    UserId = $"StreamingBothWays 第{i}次请求"
                });
                await Task.Delay(TimeSpan.FromSeconds(1));
            }

            // 处理响应
            var respTask = Task.Run(async () =>
            {
                while (await result.ResponseStream.MoveNext())
                {
                    var resp = result.ResponseStream.Current;
                    Console.WriteLine($"Code={resp.Code},Result={resp.Result},Message={resp.Message}");
                }
            });

            // 等待请求发送完毕
            await result.RequestStream.CompleteAsync();

            // 等待响应处理
            await respTask;
        }
    }
}

```
### 4.4 添加配置信息
```xml
<appSettings>
	<!--主机配置-->
	<add key="host" value="0.0.0.0" />
	<add key="httpPort" value="5000" />
	<add key="httpsPort" value="7000" />
	<!--Jwt配置-->
	<add key="securityKey" value="grpc.dennis.com" />
	<add key="issuer" value="https://grpc.dennis.com" />
	<!--token过期时间：分钟-->
	<add key="expire" value="10" />
</appSettings>
```
### 4.5 修改程序入口
修改`Program.cs`
```csharp
using System;
using GrpcClient.Test;

namespace GrpcClient
{
    internal class Program
    {
        static void Main(string[] args)
        {
            // Example 测试
            ExampleUnit.Run();

            Console.ReadKey();
        }
    }
}

```

## 5.SSL证书生成
### 5.1 下载安装openssl
参考文章：[https://www.cnblogs.com/dingshaohua/p/12271280.html](https://www.cnblogs.com/dingshaohua/p/12271280.html)
### 5.2 生成证书
在`GrpcCommon`的`Certs`下右键打开命令窗口输入`openssl`
#### 5.2.1 生成key
```sh
genrsa -out key.pem 2048
```
#### 5.2.1 生成pem证书
```sh
req -new -x509 -key key.pem -out cert.pem -days 3650
```
#### 5.2.1 pem证书转换成pfx证书
```sh
pkcs12 -export -out cert.pfx -inkey key.pem -in cert.pem
```

## 6.运行项目
### 6.1 拷贝证书
把整个`Certs`文件夹分别拷贝到`GrpcServer`和`GrpcClient`下的`\bin\Debug\Certs`
### 6.2 启动程序
先运行`GrpcServer`在运行`GrpcClient`即可
### 6.3 调试
右键解决方案-->属性-->启动项目-->选择多个启动项目-->F5调试即可
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230214194104483-192700589.png)
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230215112959305-2006109677.png)

## 7.源码地址
[https://gitee.com/dennisdong/net-grpc](https://gitee.com/dennisdong/net-grpc)