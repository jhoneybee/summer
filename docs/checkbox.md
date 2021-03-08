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
        <>
            <Checkbox disabled> 苹果 </Checkbox>
            <Checkbox> 桃子 </Checkbox>
            <Checkbox> 香蕉 </Checkbox>
        </>
    )
}

```

## API 

| 属性       | 说明                     | 类型                   | 默认值
|-----      |------                   |------                 |------------
|disabled   |是否禁用状态               |`boolean`              |`false`