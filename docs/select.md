---
id: select
title: Select 选择器
sidebar_label: Select 选择器
slug: /select
---

下拉选择器。


## 演示

```jsx live
/**
 * title: 基础
 * desc: 基础输入框
 **/
function simple () {
    return (
        <>
            <Select>
                <SelectOption key="1" value="1"> 选项一 </SelectOption>
                <SelectOption key="2" value="2"> 选项二 </SelectOption>
                <SelectOption key="3" value="3"> 选项三 </SelectOption>
            </Select>
        </>

    )
}
```


## API 

| 属性       | 说明                     | 类型                   | 默认值
|-----      |------                   |------                 |------------
