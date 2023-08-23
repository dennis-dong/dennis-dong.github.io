---
title: ElasticSearch使用说明
date: 2020-10-29
category:
  - ES
tag:
  - ES
---

<!-- more -->

## 1. 索引 index，相当于数据库表Table

### 1.1 查看所有索引

``` http
GET _cat/indices?v
```

### 1.2 创建索引字段映射关系

``` http
PUT /test
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "age": {
        "type": "long"
      },
      "address": {
        "type": "keyword"
      },
      "birthday": {
        "type": "date",
        "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
      }
    }
  }
}
```

### 1.3 获取索引信息

``` json
# 获取所有信息
GET /test

# 获取设置信息
GET /test/_settings

# 获取映射关系
GET /test/_mappings
```

### 1.4 添加索引字段

```http
POST /test/_mappings
{
  "properties": {
    "remark": {
      "type": "text"
    }
  }
}
```

### 1.5 删除索引

```http
DELETE /test
```



## 2. 文档 doc，相当于数据行Row

### 2.1 添加数据

```http
POST test/_doc
{
  "name": "dennis",
  "age": "18",
  "birthday": "2022-09-27 11:28:06",
  "address": "上海市杨浦区隆昌路666号"
}
```

### 2.2 修改数据（全量）

```http
PUT test/_doc/<id>
{
  "name": "dennis1",
  "age": "188",
  "birthday": "2022-09-27 11:28:06",
  "address": "上海市杨浦区隆昌路888号"
}
```

### 2.3 修改数据（局部）

```http
POST test/_update/<id>
{
  "doc": {
    "name": "上海",
    "age": "20"
  }
}
```

### 2.4 删除数据

```http
DELETE /test/_doc/<id>
```

### 2.5 查询全部数据

```http
GET test/_search
{
  "query": {
    "match_all": {}
  }
}
```

### 2.6 分词查询（text类型的字段才支持分词查询）

```http
GET test/_search
{
  "query": {
    "match": {
      "name": "海"
    }
  }
}
```

### 2.7 精确查询

```http
GET test/_search
{
  "query": {
    "match": {
      "name.keyword": "上海"
    }
  }
}
```



## 3. 复合查询

### 3.1 多条件查询（and）

```http
GET test/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "name": {
              "value": "dennis"
            }
          }
        },
        {
          "query_string": {
            "default_field": "address",
            "query": "上海"
          }
        }
      ]
    }
  }
}
```

### 3.2 多条件查询（or）

```http
GET test/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "term": {
            "name": {
              "value": "dennis"
            }
          }
        },
        {
          "query_string": {
            "default_field": "address",
            "query": "is"
          }
        }
      ]
    }
  }
}
```

### 3.3 分组查询

```http
# 汇总条目
GET test/_search
{
  "aggs": {
    "age_group": {
      "terms": {
        "field": "age"
      }
    }
  },
  "size": 0
}

# 平均值
GET test/_search
{
  "aggs": {
    "age_group": {
      "avg": {
        "field": "age"
      }
    }
  },
  "size": 0
}
```