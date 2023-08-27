---
title: NET中对List集合对比差异，Get，Post请求
description: NET中对List集合对比差异，Get，Post请求
date: 2020-07-29
category:
  - Net
tag:
  - List集合
  - Request
---

<!-- more -->

### 1、键值排序

```csharp
Dictionary<int, List<string>> dic = new Dictionary<int, List<string>>
{
    3, new List<string> {"3"},
    2, new List<string> {"2"}
};

//判断键值对中是否存在某个键
if (!dic.ContainsKey(1))
   dic.Add(1, new List<string> {"1"});
//将键值对按key值降序排序
dicList = dic.OrderByDescending(p => p.Key).ToDictionary(p => p.Key, o => o.Value);
```

### 2、List集合对比
```csharp
合并
List<int> listA = new List<int> { 1, 4, 8, 9, 7, 8, 3 };
List<int> listB = new List<int> { 13, 4, 17, 29, 2 };
List<int> ResultA = listA.Union(listB).ToList(); //剔除重复项
List<int> ResultB = listA.Concat(listB).ToList(); //保留重复项

比较相同
var list1 = new List<string>() { "cxk@wlync.com" };
var list2 = new List<string>() { "cxk@wlync.com" };
var result = list1.All(list2.Contains);
list1 = new List<string>() { "cxk@wlync.com" };
list2 = new List<string>() { "CXK@wlync.com" };
result = list1.All(list2.Contains);

比较差异
var oldMembersSipList = new List<string> { "q", "w", "e" };
var newMemberList = new List<string> { "a", "w", "d", "e" };

//old和new中同时存在
var bothExist = oldMembersSipList.Where(a => newMemberList.Exists(a.Contains)).ToList();
//old中存在，new中不存在
var oldExits = oldMembersSipList.Where(a => !newMemberList.Exists(a.Contains)).ToList();
//new中存在，old中不存在
var newExits = newMemberList.Where(a => !oldMembersSipList.Exists(a.Contains)).ToList();
```

### 3、接口请求
需要`NuGet`依赖包`RestSharp`
官方使用文档：[https://restsharp.dev](https://restsharp.dev)
#### POST
```csharp
var client = new RestClient(BaseUrl);
var request = new RestRequest("/api/business/batchreadings", Method.POST);
request.AddHeader("token", token);
request.AddHeader("time", beginTime); //起始时间“yyyy-mm-dd hh:mi:ss”如： 2018-11-05 10:00:00
request.AddHeader("endtime", endTime); //结束时间“yyyy-mm-dd hh:mi:ss”如： 2018-11-05 10:00:00
request.RequestFormat = DataFormat.Json; 
try
{
   var response = client.Execute<object>(request);
   if (response.StatusCode == HttpStatusCode.OK)
    {
       var msgTest = response.Content;
    }
 }
catch (Exception ex)
{
    result.errmsg = ex.Message;
}
```

#### GET
```csharp
var client = new RestClient(BaseUrl);
RestRequest request = new RestRequest("/DataPass/SysAppletWashingPosServiceV1", Method.GET);
request.AddParameter("sign", signature);
request.AddParameter("code", value);
request.AddParameter("sid", "20170427000001");
request.RequestFormat = DataFormat.Json;

try
{
    var requestResponse = client.Execute<AuthorizationCenterResponse>(request);
    if (requestResponse.StatusCode == HttpStatusCode.OK)
    {
        msgTest = "请求接口返回数据Content：" + requestResponse.Content;

    }
}
catch (Exception ex)
{
    result.errmsg = ex.Message;
}
```