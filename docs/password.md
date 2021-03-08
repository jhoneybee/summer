---
id: password
title: Password 密码输入框
sidebar_label: Password 密码输入框
slug: /password
---

用来输入敏感信息的输入框

```jsx live
/**
 * title: 基础
 * desc: 一个基础的密码输入框
 **/
function simple () {
    return <Password placeholder="密码输入信息" />
}

```

## API 

| 属性       | 说明                     | 类型                   | 默认值
|-----      |------                   |------                 |------------
|disabled   |是否禁用状态               |`boolean`              |`false`
|placeholder|空白内容的时候显示的文本信息  |`string`               | - 
