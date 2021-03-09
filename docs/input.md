---
id: input
title: Input 输入框
sidebar_label: Input 输入框
slug: /input
---

通过鼠标或键盘输入内容.


## 演示

```jsx live
/**
 * title: 基础
 * desc: 基础输入框
 **/
function simple () {
    return (
        <>
            <Input prefix={<AiOutlineUser />}/>
            <br/>
            <br/>
            <Input
                placeholder="空白时显示的文本信息"
                onChange={(e) => {
                    console.log(e.target.value);
                }}
            />
        </>

    )
}
```



## API 

| 属性       | 说明                     | 类型                   | 默认值
|-----      |------                   |------                 |------------
|disabled   |是否禁用状态               |`boolean`              |`false`
|placeholder|空白内容的时候显示的文本信息  |`string`               | - 
|prefix     |带有前缀图标的 input        |`ReactNode`            | -
|suffix     |带有后缀图标的 input        |`ReactNode`            | -