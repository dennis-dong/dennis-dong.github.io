---
title: AD获取成员隶属组成员InvokeGet("memberOf")
date: 2021-08-13
category:
  - Net
  - AD
tag:
  - AD
---

<!-- more -->

### 关于AD获取成员隶属于组成员问题

获取结果默认返回object类型，可能是string类型，也可能是object[]类型，所以只有一个结果的时候是string类型，直接返回object[]会报错

```csharp
private static IEnumerable<object> GetGroupByAdUser(string filter)
        {
            var entry = new DirectoryEntry(_localAdOperation.LocalContextSource.LdapUrl,
                _localAdOperation.LocalContextSource.UserName,
                _localAdOperation.LocalContextSource.Password,
                _localAdOperation.LocalContextSource.AuthenticationTypes);

            var deSearch = new DirectorySearcher(entry)
            {
                Filter = filter,
                SearchScope = SearchScope.Subtree
            };

            try
            {
                var result = deSearch.FindOne()?.GetDirectoryEntry().InvokeGet("memberOf");
                switch (result)
                {
                    case null:
                        return new List<object>();
                    case string _:
                        return new List<object> { result };
                    default:
                        return (object[])result;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("获取组成员失败," + ex.Message);
            }
        }
```