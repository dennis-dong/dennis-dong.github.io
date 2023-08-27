---
title: python判断密码连续，重复，大小写、数字、符号混合密码复杂度要求
description: python判断密码连续，重复，大小写、数字、符号混合密码复杂度要求
date: 2022-09-22
category:
  - Python
tag:
  - 密码验证
---

<!-- more -->

# 一、python 判断密码连续，重复，大小写、数字、符号混合密码复杂度要求

## 1. 运行环境

> python 3.6.8

## 2. 密码必须包含大小写、数字、特殊符号中的3种且长度为8-16位

```python
def verifyPassword(pwd: str):
    '''
	验证密码复杂度要求,密码必须由大小写字母、数字和特殊字符!@#$%^&*组成
	pwd: 要验证的密码
	'''
    # 必须4种全部包含
    # pattern = r'^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*,\.])[0-9a-zA-Z!@#$%^&*,\\.]{8,16}$'

    # 包含3种即可
    pattern = r'^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,16}$'
    res = re.search(pattern, pwd)
    return True if res else False
```

> 测试结果

```python
============Start================
{'12345678': False}
{'asdfghjk': False}
{'ASDFGHJK': False}
{'!@#$%^&*': False}
{'12345com': False}
{'Denniscom': False}
{'DENNIS!@#$': False}
{'Dennis.com': True}
{'d1nnis.com': True}
{'123&^FGS': True}
{'QWEasd1234': True}
{'QWEasd#$%^': True}
{'D1nnis.com': True}
{'Aa1': False}
{'Aa1234567890.com': True}
{'Aa1234567890.com.cn': False}
============End================
```

## 3. 密码不能3位及以上连号字母或数字

```python
def isSeries(pwd: str, seriesCount: int = 3):
    '''
    判断密码是否连续
    pwd: 密码
    seriesCount: 连续个数
    '''
    if pwd and (len(pwd) > 0):
        # 自身算起
        ascSeriesCount = 1
        descSeriesCount = 1
        # 存在顺序型的连续性的字符串
        for i in range(len(pwd)):
            currentCharCode = pwd[i]
            if i == 0:
                prevCharCode = ""
            else:
                prevCharCode = pwd[i - 1]
                if currentCharCode == chr(ord(prevCharCode) + 1):
                    ascSeriesCount += 1
                    if ascSeriesCount == seriesCount:
                        return True
                else:
                    ascSeriesCount = 1

        # 存在逆序性的连续性的字符串*/
        for i in range(len(pwd)):
            currentCharCode = pwd[i]
            if (i - 1) >= 0:
                prevCharCode = pwd[i - 1]
            else:
                prevCharCode = ""
            if chr(ord(currentCharCode) + 1) == prevCharCode:
                descSeriesCount += 1
                if descSeriesCount == seriesCount:
                    return True
            else:
                descSeriesCount = 1
    return False
```

> 测试结果

```python
============Start================
{'abc': True}
{'abcd': True}
{'ABC': True}
{'ABCD': True}
{'aBc': False}
{'aBcd': False}
{'cba': True}
{'dcba': True}
{'CBA': True}
{'DCBA': True}
{'CbA': False}
{'DCbA': False}
{'123': True}
{'1234': True}
{'321': True}
{'AB': False}
{'BA': False}
{'aB': False}
{'Ba': False}
{'abdce': False}
============End================
```

## 4. 密码不能连续3个及以上重复字符

```python
def isRepeat(pwd: str, repeatCount: int = 3):
    '''
    判断密码是否包含重复字段
    '''
    if pwd and (len(pwd) > 0):
        ascRepeatCount = 1
        for i in range(len(pwd)):
            currentChar = pwd[i]
            if i == 0:
                prevChar = ""
            else:
                prevChar = pwd[i - 1]
            if currentChar == prevChar:
                ascRepeatCount += 1
                if ascRepeateCount == repeatCount:
                    return True
            else:
                ascRepeatCount = 1
    return False
```

> 测试结果

```python
============Start================
{'112234556': False}
{'aaqwe': False}
{'!@@#$%^&*': False}
{'1222345com': True}
{'Dennnniscom': True}
{'asd000qweh': True}
============End================
```

## 5. 密码不能包含姓名大小写全拼

```python
# 该方法需要引入pypinyin包
from pypinyin import lazy_pinyin

def isContainsName(pwd: str, name: str):
    '''
    判断密码中是否包含名称大小写全拼
    pwd: 密码
    name: 名称汉字
    '''
    if name == None or name == '':
        return False
    
    nameArr = lazy_pinyin(name)
    pinyinName = ''.join(nameArr)
    for item in nameArr:
        pinyinName += item
    if pwd.lower().__contains__(pinyinName.lower()):
        return True
    else:
        return False
```

> 测试结果 

```python
pwd = 'zhangsan6123'

============Start================
{'zhangsan': True}
{'张三': True}
{'lisi': False}
{'李四': False}
{'': False}
============End================
```

## 6. 汉字转拼音

```python
# 该方法需要引入pypinyin包
from pypinyin import lazy_pinyin
nameArr = lazy_pinyin(item)
```

> 测试结果

```py
============Start================
{'还行': ['hai', 'xing']}
{'银行': ['yin', 'hang']}
{'行': ['xing']}
{'长': ['zhang']}
{'行长': ['xing', 'zhang']}
{'长大': ['zhang', 'da']}
{'长度': ['chang', 'du']}
{'行不行': ['xing', 'bu', 'xing']}
{'中国银行很行': ['zhong', 'guo', 'yin', 'hang', 'hen', 'xing']}
{'zhongguo': ['zhongguo']}
============End================
```