---
title: layui富文本的使用注意事项以及拓展
date: 2020-07-16
category:
  - Web
tag:
  - Layui
---

<!-- more -->

## 一、引入layui.js文件

## 二、初始化编辑器     
**PS：layedit.set({}) 方法必须要在初始化编辑器之前**

```js
var editIndex, layedit, layer;
$(function () {
    //layui.use(['element', 'jquery', 'form', 'layedit', 'flow'], function () {
    layui.use(['layedit'], function () {
        //var element = layui.element;
        //var form = layui.form;
        layer = layui.layer;
        layedit = layui.layedit;

        //设置图片上传
        layedit.set({
            uploadImage: {
                url: '', //接口url
                type: 'post', //默认post
                size: '@ViewBag.ImgSize',//文件大小KB
                //accept: '.jpg'
            }
        });

        //初始化编辑器
        editIndex = layedit.build('remarkEditor', {
            tool: ["strong", "italic", "underline", "del", "|", "left", "center", "right", "|", "face", "link", "unlink", "image", "code"],
            height: 600, //设置编辑器高度
        });


        $(".layui-layedit .layui-unselect.layui-layedit-tool").append('<i class="layui-icon layedit-tool-preview" title="在线预览" ><i class="fa fa-eye"></i></i>');
        $(".layedit-tool-preview").click(function () {
            layer.open({
                title: '在线预览',
                shade: 0.2,
                content: layedit.getContent(editIndex),
                //offset: 'auto',
                area: ['90%', '90%'],//(top.window.innerHeight * 0.80).toString()]
            });
        });
    });//layui 结束
});

var editContent = $.trim(layedit.getContent(editIndex));  //取值
layedit.setContent(editIndex, data.Art_FullContent);  //赋值
```

## 三、最后的效果图就是这样的
![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20200825151129568-1095951926.png)

## 四、Tool工具栏的功能可以自己根据layui中layedit.js自行修改吧，防止缓存在layui.js开头的n方法中加上 version: true 就可以了
### 1、修改URL链接默认target="_blank"
找到 link: function (i) {}方法，b.call()中去除target参数，这个是点击的时候赋值的
下面的参数把e.target 改成固定的 "_blank"就可以了

```js
link: function (i) {
    var a = p(i),
        l = e(a).parent();
    b.call(o, {
        href: l.attr("href"),
        //target: l.attr("target")
    },
        function (e) {
            var a = l[0];
            "A" === a.tagName ? a.href = e.url : v.call(t, "a", {
                target: "_blank",//e.target,
                href: e.url,
                text: e.url
            },
                i)
        })
},
```
然后超链接弹框的方法  搜索 title: "超链接" 就可以找到，然后注释掉content内容中的 打开方式的 `<li>` 布局即可

```js
type: 1,
id: "LAY_layedit_link",
area: "350px",
shade: .05,
shadeClose: !0,
moveType: 1,
title: "超链接",
skin: "layui-layer-msg",
content: [
    '<ul class="layui-form" style="margin: 15px;">',
    '<li class="layui-form-item">',
    '<label class="layui-form-label" style="width: 50px;">URL</label>',
    '<div class="layui-input-block" style="margin-left: 90px">',
    '<input name="url" lay-verify="url" value="' + (t.href || "") + '" autofocus="true" autocomplete="off" class="layui-input">',
    "</div>",
    "</li>",
    //'<li class="layui-form-item">',
    //'<label class="layui-form-label" style="width: 60px;">打开方式</label>',
    //'<div class="layui-input-block" style="margin-left: 90px">',
    //'<input type="radio" name="target" value="_self" class="layui-input" title="当前窗口"' + ("_self" !== t.target && t.target ? "" : "checked") + ">",
    //'<input type="radio" name="target" value="_blank" class="layui-input" title="新窗口"  checked="checked" >',
    //"</div>",
    //"</li>",
    '<li class="layui-form-item" style="text-align: center;">',
    '<button type="button" lay-submit lay-filter="layedit-link-yes" class="layui-btn"> 确定 </button>',
    '<button style="margin-left: 20px;" type="button" class="layui-btn layui-btn-primary"> 取消 </button>',
    "</li>",
    "</ul>"
].join(""),
```

本来想加一个显示内容的input，用于显示连接的文本内容，发现加上之后老是取不到值，不知道哪里的问题，如果有知道的就评论说一下吧
后来直接先写好文本，然后选中在点击连接进行绑定也是一样的效果，就是麻烦了一点，将就用吧。。

### 2、修改插入代码片段功能，这个需要配合highlight插件使用

```js
code: function (e) {
    k.call(o,
        function (i) {
            //console.log(i.code.replaceAll("<", "&lt").replaceAll(">", "&gt"));
            v.call(t, "pre", {
                //text: i.code,
                text: "<code>" + i.code.replaceAll("<", "&lt").replaceAll(">", "&gt") + "</code>",
                //"lay-lang": i.lang
            },
                e)
        })
},
```

### 3、预览功能拓展
尝试着搞了一下，还可以。。这个就是一个弹框就挺简单，顶部代码有说明

![](https://raw.githubusercontent.com/dennis-dong/picgo-library/master/images/blogs/2078491-20200825151533970-372650352.png)