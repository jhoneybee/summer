---
id: radio
title: Radio 单选框
sidebar_label: Radio 单选框
slug: /radio
---


```jsx live
/**
 * title: 基础
 * desc: 基础的单选框
 **/
function simple () {
    return (
        <>
            <Radio>
                <RadioItem value='man'>男人</RadioItem>
                <RadioItem value='woman'>女人</RadioItem>
            </Radio>
        </>
    )
}

```

## API 

| 属性       | 说明                     | 类型                   | 默认值
|-----      |------                   |------                 |------------
|disabled   |是否禁用状态               |`boolean`              |`false`
|checked    |指定当前是否选中            |`boolean`              |`false`
|onChange   |变化时回调函数              |`function(e:Event)`    | -
