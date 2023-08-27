---
title: python导入和导出excel，以文件流形式返回前端
description: python导入和导出excel，以文件流形式返回前端
date: 2022-10-02
category:
  - Python
tag:
  - Excel
---

<!-- more -->

目前使用过两种类库操作`excel`，一种是`xlrd`和`xlwt`，另一种是`pandas`，`pandas`是一个数据处理库，下面来介绍两种使用方式

## 使用`xlrd`和`xlwt`
### 1.导入excel
#### 1.1 安装依赖
`xlrd 1.2`版本之后只支持`xls`
`pip install xlrd`

#### 1.2 读取excel文件
```python
getColIndex(colList:list,colName:str):
    try:
        return colList.index(colName)
    except:
        return -1

def readExcel():
    filePath = 'data/excel.xls'
    # 获取workbook
    workbook = xlrd.open_workbook_xls(filePath)
    # 获取第一个sheet，多个的话可以自行遍历
    sheet = workbook.sheets()[0]
  
    # 获取excel列头信息
    colList = sheet.row_calues(0)
    # 获取所有行(包含列头)
    allRows = sheet.nrows
    for i in range(allRows):
        # 忽略第一行列头
        if i == 0:
        continue

        # 获取要处理的行数据
        rowData = sheet.row_calues(i)
        # 获取行数据中具体某一列的值
        colIndex = getColIndex(colList, 'name')
        # 如果存在该列明
        if eolIndex > -1:
            nameValue = rowData[colIndex]
        else:
            nameValue = rowData[colIndex]

        print(nameValue)
```

### 2.导出excel
#### 2.1 安装依赖包
`xlwt`不支持`xlsx`,只支持`xls`
```sh
pip install xlwt
pip install flask
```

#### 2.2 写入Excel数据返回前端
```python
import xlwt
from flask import Flask

app = Flask(__name__)


@app.route('/api/exceptExcel', methods=['get'])
def exceptExcel():
    # xlwt库将数据导入Excel
    workbook = xlwt.Workbook()
    # 添加一个表 参数为表名
    worksheet = workbook.add_sheet('sheet1')
    # 写列头，参数依次代表行，列，内容，格式(可省略，默认文本格式输出)
    worksheet.write(0, 0, '列头1')
    worksheet.write(0, 0, '列头2')
    worksheet.write(0, 0, '列头3')
    # 写入数据行
    worksheet.write(1, 0, '1')
    worksheet.write(1, 1, '2')
    worksheet.write(1, 2, '3')

    # xlwt不支持xlsx,只支持xls
    # filePath = 'excel/excelTest.xls'
    # 保存文件到本地
    # workbook.save(filePath)

    # 文件流的形式保存到内存
    stream = io.BytesIO()
    workbook.save(stream)
    fileData = stream.getvalue()
    stream.close()

    # 读取保存的文件
    # fileData = open(filePath, 'rb').read()

    # app是Falsk实例 Flask(__name__)
    response = app.make_response(fileData)
    response.headers["Content-Disposition"] = 'attachment; filename=excel.xls'
    response.headers["Content-Type"] = 'application/x-xlsx'
    return response
```
### 3.官方说明文档
[https://pypi.org/project/xlrd](https://pypi.org/project/xlrd)
[https://pypi.org/project/xlwt](https://pypi.org/project/xlwt)

## 使用`pandas`
### 1.导入excel
#### 1.1 安装依赖
`pandas`内部其实也是调用`xlrd`来处理excel，由于`xlrd 1.2`之后不在支持`xlsx`，所以需要使用`openpyxl`
`pip install openpyxl`

```python
df = pd.read_excel('app/test/excel.xlsx', engine='openpyxl')
# 获取列头
column_headers = df.columns.tolist()

# 获取所有行数据
rows = df.values.tolist()

# 打印数据行
for row in rows:
    print(row)
```

### 2.导出excel
#### 2.1 直接使用sql语句
```python
engine = create_engine('连接字符串')
# 使用read_sql_query执行查询并将结果读取为DataFrame
df = pd.read_sql_query(query, engine)

# 创建一个 BytesIO 对象来保存 Excel 文件流
excel_file = io.BytesIO()

# 列名
headerList = ['4A帐号', 'AD帐号', '邮箱', '显示名', '姓名全拼', '英文名', '组织ID', '组织名称', '手机号', 'OAID', 'SAPID', '帐号状态', '创建时间', '最后更新时间']
# 将 DataFrame 写入 Excel 文件流
df.to_excel(excel_file, index=False, header=headerList)

# 设置文件流指针到开始位置
excel_file.seek(0)

fileName = f'account-{nowToStr(1)}.xlsx'

response = app.make_response(excel_file.getvalue())
response.headers["Content-Disposition"] = f'attachment; filename={fileName}'
response.headers["Content-Type"] = 'application/x-xlsx'
return response
```
#### 2.2 使用处理数据
```python
data = {'id': [], 'name': []}
idData = []
nameData = []
for i in range(10):
    idData.append(i)
    nameData.append(f'dennis{i}')

data.update({'id': idData})
data.update({'name': nameData})
df = pd.DataFrame(data)
df.to_excel('test.xlsx', index=False)
```
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20230605134732116-365270410.png)

### 3.pandas官方文档
[https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_excel.html](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_excel.html)