---
id: button
title: Button 按钮
sidebar_label: Button 按钮
slug: /button
---

按钮,用来点击或则执行一个操作. 按钮自带防止多次点击.

## 演示

```jsx live
/**
 * title: 基础按钮
 * desc: 用来展现按钮的三种类型
 **/
function simple() {
    return (
        <Space>
            <Button type="primary" key="primary" > primary 类型 </Button>
            <Button type="default" key="default"> default 类型 </Button>
            <Button type="text" key="text"> text 类型 </Button>
        </Space>
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
        <Space>
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
        </Space>
    )
}
```


## API

|属性               |说明                |类型                                                                  |默认值
|-------            |------             |------                                                               |------------
|danger             |设置危险按钮         |`boolean`                                                            | `false`
|disabled	          |按钮失效状态         |`boolean`                                                            | `false`
|type               |设置按钮类型         |`primary` \| `text` \| `default`                                     | `default` 
|onClick            |点击按钮时的回调      |`(event) => void`                                                    |
