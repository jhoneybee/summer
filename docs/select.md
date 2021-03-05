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
    return (
        <>
            <Select
                style={{ marginRight: 10}}
                value={value}
                onChange={({ value }) => {
                    setValue(value);
                }}
            >
                <SelectOption key="1" value="1"> 设置为可编辑属性 </SelectOption>
                <SelectOption key="2" value="2"> 选项二 </SelectOption>
                <SelectOption key="3" value="3"> 选项三 </SelectOption>
            </Select>
            <Select
                value={value1}
                readOnly={false}
                onChange={({ value }) => {
                    setValue1(value);
                }}
            >
                <SelectOption key="1" value="1"> 设置为只读属性 </SelectOption>
                <SelectOption key="2" value="2"> 选项二 </SelectOption>
                <SelectOption key="3" value="3"> 选项三 </SelectOption>
            </Select>
        </>

    )
}
```

```jsx live
/**
 * title: 大数据加载
 * desc: 根据客户端的电脑性能,会有不同的差异表现. 目前显示十万条数据加载
 **/

function simple () {
    const [value, setValue] = useState("0");
    const [options, setOptions] = useState([])
    useEffect(() => {
        const options = [];
        for(let i=0; i < 100000 ; i += 1) {
            options.push(<SelectOption key={i} label={`${i} 条选择项目`} />);
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
|value      |当前选中的值               | `string` \| `number`  | `''`
|readOnly   |设置为只读属性              | `boolean`             | `true`
|onChange   |用户选中数据的时候触发的事件  | `(selectOptionClickType: SelectOptionClickType) => void` | -

### SelectOptionClickType 类型说明

- value: `string | number`  当期选中的值
- children: `ReactNode`   当期的Select的组件
- event: `React.MouseEvent<HTMLLIElement, MouseEvent>` 鼠标点击事件