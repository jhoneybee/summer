---
id: button
title: Button 按钮
sidebar_label: Button 按钮
slug: /
---

按钮,用来点击或则执行一个操作. 按钮自带防止多次点击.

提供了五种按钮。

- 主按钮：用于主行动点，一个操作区域只能有一个主按钮。
- 默认按钮：用于没有主次之分的一组行动点。
- 虚线按钮：常用于添加操作。
- 文本按钮：用于最次级的行动点。
- 链接按钮：用于作为外链的行动点。

以及四种状态属性与上面配合使用。

- 危险：删除/移动/修改权限等危险操作，一般需要二次确认。
- 幽灵：用于背景色比较复杂的地方，常用在首页/产品页等展示场景。
- 禁用：行动点不可用的时候，一般需要文案解释。
- 加载中：用于异步操作执行时间较长的任务.

## 演示

```jsx live
function simple() {
    return (
        <Button> 这是一个简单的按钮 </Button>
    )
}
```


## API

|属性               |说明                |类型                                                                  |默认值
|-------            |------             |------                                                               |------------
|danger             |设置危险按钮         |`boolean`                                                            | `false`
|disabled	          |按钮失效状态         |`boolean`                                                            | `false`
|ghost              |幽灵属性，使按钮背景透明|`boolean`                                                           | `false`
|href               |点击跳转的地址，指定此属性 button 的行为和 a 链接一致| `string`                                 | -
|type               |设置按钮类型         |`primary` \| `ghost` \| `dashed` \| `link` \| `text` \| `default`    | `default` 
|icon               |设置按钮的图标组件    |`ReactNode`                                                          | -
|onClick            |点击按钮时的回调      |`(event) => void`                                                    |


## FAQ 

### 如何设置按钮的`href`属性的打开方式?


href 和原生的href 有些少许的区别, 例如如果要在新的标签页中打开,那么 `href` 的值为 <u>`_blank->www.google.com`</u> 如果直接填写网址,那么就采用`_self`方式打开.


打开方式如下

- `_blank` 在新窗口中打开被链接文档。
- `_self` 默认在相同的框架中打开被链接文档。
- `_parent` 在父框架集中打开被链接文档
- `_top` 在整个窗口中打开被链接文档。
- `${framename}` 在指定的框架中打开被链接文档。
