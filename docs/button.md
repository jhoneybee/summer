---
id: button
title: Button 按钮
sidebar_label: Button 按钮
slug: /
---

按钮,用来点击或则执行一个操作. 按钮自带防止多次点击.

提供了三种按钮。

| 按钮类型 | 描述
|----     |---------
|primary  | 主按钮,用于主行动点，一个操作区域只能有一个主按钮。
|default  | 默认按钮,用于没有主次之分的一组行动点
|text     | 文本按钮,用于最次级的行动点


以及两种状态属性与上面配合使用。

- 危险：删除/移动/修改权限等危险操作，一般需要二次确认。
- 禁用：行动点不可用的时候，一般需要文案解释。

## 演示

```jsx live
/**
 * title: 基础按钮
 * desc: 用来展现按钮的三种类型
 **/
function simple() {
    return (
        <>
            <Button type="primary"> primary 类型 </Button>
            <Button type="default"> default 类型 </Button>
            <Button type="text"> text 类型 </Button>
        </>
    )
}
```

```jsx live
/**
 * title: 长任务
 * desc: 当按钮执行很长的任务的时候,会自动变灰,等待任务执行完成后,才可以执行下一次的请求
 **/
function simple() {
    return (
        <>
            <Button
                type="primary"
                onClick={() => {
                    return new Promise(re => {
                        // 模拟网络延迟
                        setTimeout(() => {
                            re();
                        },3000)
                    })
                }}
            >
                点击执行任务
            </Button>
        </>
    )
}
```


## API

|属性               |说明                |类型                                                                  |默认值
|-------            |------             |------                                                               |------------
|block              |将按钮宽度调整为其父宽度的选项 |`boolean`                                                     | `false`
|danger             |设置危险按钮         |`boolean`                                                            | `false`
|disabled	          |按钮失效状态         |`boolean`                                                            | `false`
|href               |点击跳转的地址，指定此属性 button 的行为和 a 链接一致| `string`                                 | -
|type               |设置按钮类型         |`primary` \| `text` \| `default`                                     | `default` 
|onClick            |点击按钮时的回调      |`(event) => void`                                                    |


## FAQ 

### 如何设置按钮的`href`属性的打开方式?


`href` 和原生的 `href` 有些少许的区别, 例如如果要在新的标签页中打开
那么 `href` 的值为 `_blank->www.google.com` 如果直接填写网址,那么就采用`_self`方式打开.


打开方式如下

- `_blank` 在新窗口中打开被链接文档。
- `_self` 默认在相同的框架中打开被链接文档。
- `_parent` 在父框架集中打开被链接文档
- `_top` 在整个窗口中打开被链接文档。
- `${framename}` 在指定的框架中打开被链接文档。

> 当按钮属性具有 `href` 属性的时候,此刻按钮渲染的就是一个 `a` 标签