---
title: NET和NET Core使用JWT授权验证
date: 2021-12-22
category:
  - Net
  - JWT
tag:
  - JWT
---

<!-- more -->

## JWT介绍

参考文章 [https://www.cnblogs.com/cjsblog/p/9277677.html](https://www.cnblogs.com/cjsblog/p/9277677.html)

## 一、.NET 中使用
### 1. NuGet包
搜索JWT，下载安装(本人用的是8.2.3版本)

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211222103300557-1293560420.png)
### 2. 自定义帮助类
#### 2.1 新建interface接口
`IHttpResponseResult`
```csharp
    public interface IHttpResponseResult
    {
    }

    /// <summary>
    /// 响应数据输出泛型接口
    /// </summary>
    /// <typeparam name="T"></typeparam>
    // ReSharper disable once UnusedTypeParameter
    public interface IHttpResponseResult<T> : IHttpResponseResult
    {
    }
```
#### 2.2 新建数据响应类
`HttpResponseResult`
```csharp
    public class HttpResponseResult<T> : IHttpResponseResult<T>
    {
        /// <summary>
        /// 状态码
        /// </summary>
        public int Code { get; set; }

        /// <summary>
        /// 消息
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// 数据
        /// </summary>
        public T Data { get; set; }

        /// <summary>
        /// 成功
        /// </summary>
        /// <param name="data">数据</param>
        /// <param name="msg">消息</param>
        public HttpResponseResult<T> Success(T data = default, string msg = null)
        {
            Code = 0;
            Data = data;
            Message = msg;
            return this;
        }

        /// <summary>
        /// 失败
        /// </summary>
        /// <param name="code">状态码</param>
        /// <param name="msg">消息</param>
        /// <param name="data">数据</param>
        /// <returns></returns>
        public HttpResponseResult<T> Fail(T data = default, int code = -1, string msg = null)
        {
            Code = code;
            Message = msg;
            Data = data;
            return this;
        }
    }

    /// <summary>
    /// 响应数据静态输出
    /// </summary>
    public static class HttpResponseResult
    {
        /// <summary>
        /// 成功
        /// </summary>
        /// <param name="data">数据</param>
        /// <param name="msg">消息</param>
        /// <returns></returns>
        public static IHttpResponseResult Success<T>(T data, string msg = "message")
        {
            return new HttpResponseResult<T>().Success(data, msg);
        }

        /// <summary>
        /// 失败
        /// </summary>
        /// <param name="data">数据</param>
        /// <param name="msg">消息</param>
        /// <param name="code">状态码</param>
        /// <returns></returns>
        public static IHttpResponseResult Fail<T>(T data, string msg = null, int code = -1)
        {
            return new HttpResponseResult<T>().Fail(data, code, msg);
        }
    }
```
#### 2.3 新建模型类
`JwtToken`
```csharp
    /// <summary>
    /// Jwt Token
    /// </summary>
    public class JwtToken
    {
        /// <summary>
        /// 授权者
        /// </summary>
        public string AuthUserName { get; set; }

        /// <summary>
        /// Token过期时间
        /// </summary>
        public long ExpireTime { get; set; }

        /// <summary>
        /// Issuer
        /// </summary>
        public string Issuer { get; set; }
    }
```
#### 2.4 新建Jwt帮助类
`JwtHelper`
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
        private static readonly string secretKey = AppConfigs.SecurityKey;
        private static readonly string issuer = AppConfigs.Issuer;
        private static readonly int expire = AppConfigs.Expire;

        /// <summary>
        /// 颁发JWT Token
        /// </summary>
        /// <param name="securityKey"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public static string GenerateJwt(string userName)
        {
            //身份验证信息
            var expTime = new DateTimeOffset(DateTime.Now.AddHours(expire)).ToUnixTimeSeconds();
            var jwtToken = new JwtToken { AuthUserName = userName, ExpireTime = expTime, Issuer = issuer };
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
        public static Tuple<bool, string> ValidateJwt(string token)
        {
            try
            {
                IJsonSerializer serializer = new JsonNetSerializer();
                IDateTimeProvider provider = new UtcDateTimeProvider();
                IJwtValidator validator = new JwtValidator(serializer, provider);
                IBase64UrlEncoder urlEncoder = new JwtBase64UrlEncoder();
                IJwtAlgorithm alg = new HMACSHA256Algorithm();
                IJwtDecoder decoder = new JwtDecoder(serializer, validator, urlEncoder, alg);
                var payLoad = decoder.Decode(token, secretKey);

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
                return new Tuple<bool, string>(false, err.Message);
            }
        }
    }
}
```
### 3.配置API接口
#### 3.1 新建Conteoller
新建`LoginController`并且新建一个方法`Login`生成`JwtToken`
```csharp
    /// <summary>
    /// JWT授权
    /// </summary>
    [RoutePrefix("api/login")]
    public class LoginController : ApiController
    {
        private readonly string secretKey = AppConfigs.SecurityKey; //Jwt密钥，自定义

        /// <summary>
        /// 授权登录获取Token
        /// </summary>
        /// <param name="loginModel"></param>
        /// <returns></returns>
        [HttpPost, Route("GetToken")]
        public IHttpResponseResult Login([FromBody] Login loginModel)
        {
            try
            {
                var userName = loginModel.UserName;
                var userPwd = loginModel.UserPwd;
                //var loginRes = ChatUserDao.GetJwtUser(userName, userPwd).IsNull(); //自己的数据库验证
                var loginRes = "Dennis".Equals(userName) && "123".Equals(userPwd);
                if (loginRes)
                {
                    return HttpResponseResult.Fail(null, "The user is not found or password is error.");
                }

                var token = JwtHelper.GenerateJwt("Dennis"); //生成令牌
                return HttpResponseResult.Success(token, "Get Token Success.");
            }
            catch (Exception e)
            {
                return HttpResponseResult.Fail(null, e.Message);
            }
        }
    }
```
### 4. 类验证Token
在`App_Start`项目文件加中新建一个`ApiAuthAttribute`类，继承自`AuthorizeAttribute`

```csharp
    /// <summary>
    /// Jwt 授权验证
    /// </summary>
    public class ApiAuthAttribute : AuthorizeAttribute
    {
        private const string authHeader = "Authorization";//请求头Header中存放JwtToken的Key名称

        /// <summary>
        /// 判断授权
        /// </summary>
        /// <param name="httpContext"></param>
        /// <returns></returns>
        protected override bool IsAuthorized(HttpActionContext httpContext)
        {
            try
            {
                var httpHeader = httpContext.Request.Headers;
                var token = string.Empty;//获取token

                foreach (var keyHeader in httpHeader)
                {
                    if (authHeader.Equals(keyHeader.Key))
                    {
                        token = keyHeader.Value.FirstOrDefault();
                    }
                }

                if (token.IsEmpty())
                {
                    return false;
                }

                //解密
                var tokenRes = JwtHelper.ValidateJwt(token);
                return tokenRes.Item1;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        /// <summary>
        /// 授权失败时调用
        /// </summary>
        /// <param name="httpContext"></param>
        protected override void HandleUnauthorizedRequest(HttpActionContext httpContext)
        {
            //Token过期时，响应头添加过期标识
            httpContext.Response = httpContext.ControllerContext.Request.CreateResponse(
                HttpStatusCode.Unauthorized, HttpResponseResult.Fail(false, "Token is not found or expired, authorization failed."));
            httpContext.Response.Headers.Add("Token-Expired", "true");
        }
    }
```
### 5. 测试Token验证
```csharp
    /// <summary>
    /// 测试接口
    /// </summary>
    [RoutePrefix("api/test")]
    public class TestController : ApiController
    {
        /// <summary>
        /// Token认证测试
        /// </summary>
        /// <returns></returns>
        [HttpGet, Route("TokenAuth")]
        [ApiAuth]
        public IHttpResponseResult TokenAuth()
        {
            return HttpResponseResult.Success(true, "Auth Passed");
        }
    }
```

## 二、.NET Core 中使用
### 1. NuGet包
搜索JwtBearer，下载安装(本人安装的是5.0.7)

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211222113842150-584975420.png)

### 2. 配置授权认证
注册JWT中间件，我是单独写了一个类然后引用，也可以直接写在Startup的`ConfigureServices`方法中

```csharp
    /// <summary>
    /// JWT授权中间件
    /// </summary>
    public static class AuthorizationMiddleware
    {
        /// <summary>
        /// 注册授权服务
        /// </summary>
        /// <param name="services"></param>
        public static void AddAuthorizationService(this IServiceCollection services)
        {
            // 开启Bearer认证
            services.AddAuthentication(options =>
                {
                    // 设置默认使用jwt验证方式
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })

                // 添加JwtBearer服务
                .AddJwtBearer(o =>
                {
                    // token验证参数
                    o.TokenValidationParameters = new TokenValidationParameters
                    {
                        // 验证秘钥
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppConfig.SecretKey)),
                        // 验证颁发者
                        ValidateIssuer = true,
                        ValidIssuer = AppConfig.Issuer,
                        // 验证订阅者
                        ValidateAudience = true,
                        ValidAudience = AppConfig.Audience,
                        // 验证过期时间必须设置该属性
                        ClockSkew = TimeSpan.Zero
                    };

                    // 默认有www-authenticate响应头提示验证失败信息
                });

            // 如果需要角色控制到Action则需要配置Policy
            // 如果没有配置AddPolicy，接口直接使用[Authorize]特性即可
            // 如果接口只允许Admin或System角色的Token访问，则需要添加了[Authorize("SystemOrAdmin")]特性
            // 详细请测试LoginController的ParseToken的方法
            services.AddAuthorization(options =>
            {
                options.AddPolicy("User", policy => policy.RequireRole("User"));
                options.AddPolicy("SystemOrAdmin", policy => policy.RequireRole("Admin", "System"));
            });
        }
    }
```

**然后在Startup的`ConfigureServices`方法中添加引用**
`services.AddAuthorizationService();`

**在Startup的`Configure`方法中使用授权**
在`app.UseRouting()`之后和`app.UseEndpoints`之前添加代码

```csharp
app.UseAuthentication();//身份验证
app.UseAuthorization();//身份授权
```

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20211222123830106-1070670902.png)

### 3. JWT自定义帮助类
#### 3.1 新建Claim枚举
`JwtClaimKey`
```csharp

    /// <summary>
    /// Jwt Claim Key
    /// </summary>
    public class JwtClaimKey
    {
        /// <summary>
        /// userId
        /// </summary>
        public static string UserId = "userId";

        /// <summary>
        /// userName
        /// </summary>
        public static string UserName = "userName";
    }
```
#### 3.2 新建token模型类
`JwtTokenPayload`
```csharp
    /// <summary>
    /// Jwt Token Payload
    /// </summary>
    public class JwtTokenPayload
    {
        /// <summary>
        /// UserId
        /// </summary>
        public string UserId { get; set; }

        /// <summary>
        /// UserName
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// UserRoles
        /// </summary>
        public IEnumerable<string> UserRoles { get; set; }
    }
```
#### 3.3 新建JWT帮助类
```csharp
    /// <summary>
    /// JWT 帮助类
    /// </summary>
    public static class JwtHelper
    {
        private static readonly string Iss = AppConfig.Issuer;
        private static readonly string Aud = AppConfig.Audience;
        private static readonly string SecretKey = AppConfig.SecretKey;
        private static readonly int Expire = AppConfig.Expire;

        /// <summary>
        /// 生成Token
        /// </summary>
        /// <param name="userRoles"></param>
        /// <param name="payload"></param>
        /// <returns></returns>
        public static string GenerateJwt(IEnumerable<string> userRoles, JwtTokenPayload payload)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtClaimKey.UserId, payload.UserId),
                new Claim(JwtClaimKey.UserName, payload.UserName)
            };

            // 可以将一个用户的多个角色全部赋予，比如参数System,Admin，那么该token即拥有两个角色
            claims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

            //秘钥 (SymmetricSecurityKey 对安全性的要求，密钥的长度太短会报出异常)
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var jwt = new JwtSecurityToken(
                issuer: Iss,
                audience: Aud,
                claims: claims,
                expires: DateTime.Now.AddHours(Expire),
                signingCredentials: credentials);

            var jwtHandler = new JwtSecurityTokenHandler();
            var encodedJwt = jwtHandler.WriteToken(jwt);

            return encodedJwt;
        }

        /// <summary>
        /// 解析Token
        /// </summary>
        /// <param name="jwtToken"></param>
        /// <returns></returns>
        public static Tuple<bool, JwtTokenPayload> ValidateJwt(string jwtToken)
        {
            var jwtHandler = new JwtSecurityTokenHandler();
            var token = jwtHandler.ReadJwtToken(jwtToken);

            try
            {
                var userId = token.Payload.GetValueOrDefault(JwtClaimKey.UserId).ToString();
                var userName = token.Payload.GetValueOrDefault(JwtClaimKey.UserName).ToString();
                var roles = token.Payload.GetValueOrDefault(ClaimTypes.Role);
                var roleList = new List<string>();

                switch (roles)
                {
                    case string _:
                        roleList = new List<string> { roles.ToString() };
                        break;
                    default:
                        var a = JsonConvert.DeserializeObject<JArray>(roles.ToString());
                        roleList.AddRange(a.Select(obj => obj.Value<string>()));
                        break;
                }

                var payLoad = new JwtTokenPayload
                {
                    UserId = userId,
                    UserName = userName,
                    UserRoles = roleList
                };
                return new Tuple<bool, JwtTokenPayload>(false, payLoad);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return new Tuple<bool, JwtTokenPayload>(false, null);
            }
        }
    }
```

**密钥等相关配置动态配置在`appsettings.json`文件中**

```json
  "JwtSetting": {
    "Issuer": "dennisdong",
    "Audience": "https://www.dennisdong.top",
    "SecretKey": "D@1#n$n%i&s.D*0n!g",
    "Expire": "2"
  }
```

### 4. 生成和测试Token
#### 4.1 新建模型类
`RoleModel`
```csharp
    /// <summary>
    /// 用户角色
    /// </summary>
    public class RoleModel
    {
        /// <summary>
        /// 角色
        /// </summary>
        public IEnumerable<string> UserRoles { get; set; }
    }
```
#### 4.2 新建Api控制器
`LoginController`
```csharp
    /// <summary>
    /// 首页
    /// </summary>
    [Route("api/login/[action]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        /// <summary>
        /// 登录获取Token
        /// </summary>
        /// <param name="role"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult Login([FromBody] RoleModel role)
        {
            string token;
            if (role.UserRoles.Null())
            {
                token = "参数UserRoles为null";
                return BadRequest(new { Error = token });
            }

            var payLoad = new JwtTokenPayload
            {
                UserId = Guid.NewGuid().ToString(),
                UserName = "Dennis"
            };
            token = JwtHelper.GenerateJwt(role.UserRoles, payLoad);
            return Ok(new { Token = token });
        }

        /// <summary>
        /// 解析Token
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        //[Authorize("SystemOrAdmin")]
        [Authorize]
        public IActionResult ParseToken()
        {
            //需要截取Bearer 
            var tokenHeader = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var tokenRes = JwtHelper.ValidateJwt(tokenHeader);
            return Ok(tokenRes.Item2);
        }
    }
```
## 三、源码地址
Gitee：[https://gitee.com/dennisdong/net-coreapi-demo](https://gitee.com/dennisdong/net-coreapi-demo)

## 四、Swagger配合JWT使用
请参考文章：[https://www.dennisdong.top/archives/2021/Net和Net-Core集成Swagger以及配合JWT身份验证.html](https://www.dennisdong.top/archives/2021/Net和Net-Core集成Swagger以及配合JWT身份验证.html)

## 五、WebAPI 跨域问题
请参考文章：[https://www.dennisdong.top/archives/2021/NET-WebAPI-跨域问题(CORS-policy-No-Access-Control-Allow-Ogigin).html](https://www.dennisdong.top/archives/2021/NET-WebAPI-跨域问题(CORS-policy-No-Access-Control-Allow-Ogigin).html)