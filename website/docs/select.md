---
id: select
title: Select 选择器
sidebar_label: Select 选择器
slug: /select
---

下拉选择器。如果设置为 `readOnly` 则表示输入框中不可编辑. 但是下拉框功能仍然存在.

## 演示

```jsx live
/**
 * title: 基础
 * desc: 基础输入框
 **/
function simple () {
    const [value, setValue] = useState("1");
    const [value1, setValue1] = useState("1");
    const [value2, setValue2] = useState("1");
    return (
        <Space>
            <Select
                style={{ marginRight: 10}}
                value={value}
                readOnly={false}
                onChange={({ value }) => {
                    setValue(value);
                }}
            >
                <SelectOption key="1" title="设置为可编辑属性" />
                <SelectOption key="2" title="选项二" />
                <SelectOption key="3" title="选项三" />
            </Select>
            <Select
                value={value1}
                onChange={({ value }) => {
                    setValue1(value);
                }}
            >
                <SelectOption key="1" title="默认为只读属性" />
                <SelectOption key="2" title="选项二" />
                <SelectOption key="3" title="选项三" />
            </Select>

            <Select
                value={value2}
                disabled
                onChange={({ value }) => {
                    setValue2(value);
                }}
            >
                <SelectOption key="1" title="设置为禁用属性" />
                <SelectOption key="2" title="选项二" />
                <SelectOption key="3" title="选项三" />
            </Select>
        </Space>

    )
}
```

```jsx live
/**
 * title: 大数据加载
 * desc: 根据客户端的电脑性能,会有不同的差异表现. 目前显示十万条数据加载
 **/

function simple () {
    const [value, setValue] = useState('0');
    const [options, setOptions] = useState([])
    useEffect(() => {
        const options = [];
        for(let i=0; i < 100000 ; i += 1) {
            options.push(<SelectOption key={i} title={`${i} 条选择项目`} ></SelectOption>);
        }
        setOptions(options);
    }, [])
    return (
        <>
            <Select
                style={{ marginRight: 10}}
                value={value}
                onChange={({ value, label }) => {
                    console.log(`label: ${value}, value: ${value}`)
                    setValue(value);
                }}
            >
                {options}
            </Select>
        </>

    )
}
```



## API 

### Select 属性说明

| 属性       | 说明                     | 类型                   | 默认值
|-----      |------                   |------                 |------------
|value      |当前选中的值               | `string` \| `number`  |  `''`
|readOnly   |设置为只读属性              | `boolean`             | `false`
|allowClear |是否支持清除                | `boolean`             | `true`
|disabled   |是否禁用状态               |`boolean`              |`false`
|onChange   |用户选中数据的时候触发的事件  | `(selectOptionClickType: SelectOptionClickType) => void` | -

### SelectOptionClickType 类型说明

- value: `string | number`  当期选中的值
- children: `ReactNode`   当期的Select的组件
- event: `React.MouseEvent<HTMLLIElement, MouseEvent>` 鼠标点击事件