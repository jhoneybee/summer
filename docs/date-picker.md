---
id: date-picker
title: DatePicker 日期选择框
sidebar_label: DatePicker 日期选择框
slug: /date-picker
---


```jsx live
/**
 * title: 基础
 * desc: 日期选择框, 在 input 输入框中
 **/
function simple () {
    return (
        <>
            <DatePicker />
        </>
    )
}

```


```jsx live
/**
 * title: 格式化
 * desc: 格式化显示的日期信息
 **/
function simple () {
    return (
        <>
            <DatePicker format="yyyy年 MM月 dd日" />
        </>
    )
}

```


```jsx live
/**
 * title: 禁用
 * desc: 禁用日期框
 **/
function simple () {
    return (
        <>
            <DatePicker format="yyyy年 MM月 dd日" disabled />
        </>
    )
}

```


```jsx live
/**
 * title: 日期面板
 * desc: 显示日期面板信息,嵌入到其他地方
 **/
function simple () {
    return (
        <>
            <DatePickerPanel />
        </>
    )
}

```

## API 

### DatePicker

| 属性       | 说明                     | 类型                   | 默认值
|-----      |------                   |------                 |------------
|format     |设置日期格式               |`string`               | `yyyy-MM-dd`
|value      |日期                      |`Date`                 | -
|readOnly   |输入框是否只读, 默认情况下不允许手动输入,只能选择 |`boolean`              | `false`
|allowClear |是否支持清除                | `boolean`             | `true`
|disabled   |是否禁用状态               |`boolean`              |`false`

### 格式化日期

格式化日期字符串采用标准的日期格式化格式 https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table


```js
// ❌ 错误
format(new Date(), 'YYYY-MM-DD')
//=> 2018-10-283

// ✅ 正确
format(new Date(), 'yyyy-MM-dd')
//=> 2018-10-10

```
