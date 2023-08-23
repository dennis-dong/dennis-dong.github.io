---
title: C#汉字转拼音（Microsoft.PinYinConverter）
date: 2022-02-28
category:
  - Net
tag:
  - 拼音转换
---

<!-- more -->

## 1. NuGet程序包 

`Microsoft.PinYinConverter`

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220228133446568-2066773851.png)

## 2. 使用方法

```csharp
var chineseChar = new ChineseChar('中');
var pyStr = chineseChar.Pinyins
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20220228133841831-1952260810.png)

多音字返回多个读音，最后一位代表声调，每次只能转换一个字符

## 3. 封装

```csharp
public static class PinYinHelper
{
    ///<summary>
    /// 汉字
    /// </summary>
    private static string ChineseReg = "^[\\u4E00-\\u9FA5]+$";

    public static string GetPinYinFull(string str)
    {
        var pySb = new StringBuilder();
        foreach (var itemChar in str)
        {
            //过滤非汉字的字符，直接返回
            var reg = new Regex(ChineseReg);
            if (!reg.IsMatch(itemChar.ToString()))
            {
                pySb.Append(itemChar);
            }
            else
            {
                var chineseChar = new ChineseChar(itemChar);
                var pyStr = chineseChar.Pinyins.First().ToLower();
                pySb.Append(pyStr.Substring(0, pyStr.Length - 1));
            }
        }
        return pySb.ToString();
    }
}
```