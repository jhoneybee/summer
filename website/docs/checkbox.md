---
id: checkbox
title: Checkbox 多选框
sidebar_label: Checkbox 多选框
slug: /checkbox
---

多选框。


```jsx live
/**
 * title: 基础
 * desc: 基础的多选框
 **/
function simple () {
    return (
        <Space>
            <Checkbox disabled> 苹果 </Checkbox>
            <Checkbox> 桃子 </Checkbox>
            <Checkbox> 香蕉 </Checkbox>
        </Space>
    )
}

```

## API 

| 属性       | 说明                     | 类型                   | 默认值
|-----      |------                   |------                 |------------
|disabled   |是否禁用状态               |`boolean`              |`false`
|checked    |指定当前是否选中            |`boolean`              |`false`
|onChange   |变化时回调函数              |`function(e:Event)`    | -
