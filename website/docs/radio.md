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
        <Space>
            <RadioGroup
                value='woman'
                onChange={(changeValue) => {
                    console.log(changeValue);
                }}
            >
                <Radio key="man" value='man'>男人</Radio>
                <Radio key="woman" value='woman'>女人</Radio>
            </RadioGroup>
        </Space>
    )
}

```

## API 

| 属性       | 说明                     | 类型                   | 默认值
|-----      |------                   |------                 |------------
|disabled   |是否禁用状态               |`boolean`              |`false`
|value      |值            |`string` \| `number`              |`false`
|onChange   |变化时回调函数              |`function(e:Event)`    | -
