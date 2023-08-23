---
title: 判断AD帐号是否在嵌套组中
date: 2023-03-01
category:
  - Python
  - AD
tag:
  - AD
---

<!-- more -->

`用户和组的关系`: `zhangsan`隶属于组`groupA`,组`groupB`隶属于组`groupA`

## 1.判断用户
判断用户是否在某个组中（支持嵌套关系的组），想要判断`zhangsan`是否在组`groupB`中

```python
samAccountName = 'zhangsan'
groupDn= 'CN=groupB,OU=Dennis,DC=dennis,DC=com'
# samAccountName：要判断的用户
# groupDn：组的完整DN
search_filter = f'(&(objectClass=user)(objectCategory=person)(sAMAccountName={samAccountName})(memberof:1.2.840.113556.1.4.1941:={groupDn}))'
```
## 2.判断组
判断组中是否存某个用户，想要判断组`groupB`中是否存在用户`zhangsan`

```python
groupName= 'groupB'
userDn= 'CN=zhangsan,OU=Dennis,DC=dennis,DC=com'
# groupName：要判断的组
# userDn：用户的完整DN
search_filter = f'(&(objectClass=group)(objectCategory=group)(sAMAccountName={groupName})(member:1.2.840.113556.1.4.1941:={userDn}))'
```

## 3.查找一个组下的所有用户
该查询条件在`AD管理工具`中可以直接查出来，只是速度有点慢，用`第三方工具包`（只在`python`的`ldap3`中测试过）在代码中查询可能会提示`操作超时`，其他工具自行测试

```python
groupDn= 'CN=groupB,OU=Dennis,DC=dennis,DC=com'
# groupDn：组的完整DN
search_filter = f'(&(objectClass=user)(objectCategory=person)(memberof:1.2.840.113556.1.4.1941:={groupDn}))'
```

## 4.查找一个用户下隶属的所有组
该查询条件在`AD管理工具`中可以直接查出来，只是速度有点慢，用`第三方工具包`（只在`python`的`ldap3`中测试过）在代码中查询可能会提示`操作超时`，其他工具自行测试

```python
userDn= 'CN=zhangsan,OU=Dennis,DC=dennis,DC=com'
# userDn：组的完整DN
search_filter = f'(&(objectClass=group)(objectCategory=group)(member:1.2.840.113556.1.4.1941:={userDn}))'
```

## 5.参考来源
[https://learn.microsoft.com/zh-cn/windows/win32/adsi/search-filter-syntax?redirectedfrom=MSDN](https://learn.microsoft.com/zh-cn/windows/win32/adsi/search-filter-syntax?redirectedfrom=MSDN)
[https://github.com/cannatag/ldap3/issues/327](https://github.com/cannatag/ldap3/issues/327)
[https://stackoverflow.com/questions/6195812/ldap-nested-group-membership](https://stackoverflow.com/questions/6195812/ldap-nested-group-membership)