---
id: table
title: Table 表格
sidebar_label: Table 表格
slug: /table
---


```jsx live
/**
 * title: 基础
 * desc: 基础表格演示
 **/
function simple () {
    return (
        <Table
            dataSource={[{
                cells: [{
                    value: 'col-0',
                    name: 'col0',
                },{
                    value: 'col-1',
                    name: 'col1',
                },{
                    value: 'col-2',
                    name: 'col2',
                },{
                    value: 'col-3',
                    name: 'col3',
                },{
                    value: 'col-4',
                    name: 'col4',
                },{
                    value: 'col-5',
                    name: 'col5',
                },{
                    value: 'col-6',
                    name: 'col6',
                },{
                    value: 'col-7',
                    name: 'col7',
                },{
                    value: 'col-8',
                    name: 'col8',
                },{
                    value: 'col-9',
                    name: 'col9',
                },{
                    value: 'col-10',
                    name: 'col10',
                },{
                    value: 'col-11',
                    name: 'col11',
                },{
                    value: 'col-12',
                    name: 'col12',
                },{
                    value: 'col-13',
                    name: 'col13',
                },{
                    value: 'col-14',
                    name: 'col14',
                }]
            }]}
        >
            <Column title='col0' width={120} key='col0'/>
            <Column title='col1' width={120} key='col1'/>
            <Column title='col2' width={120} key='col2'/>
            <Column title='col3' width={120} key='col3'/>
            <Column title='col4' width={120} key='col4'/>
            <Column title='col5' width={120} key='col5'/>
            <Column title='col6' width={120} key='col6'/>
            <Column title='col7' width={120} key='col7'/>
            <Column title='col8' width={120} key='col8'/>
            <Column title='col9' width={120} key='col9'/>
            <Column title='col10' width={120} key='col10'/>
            <Column title='col11' width={120} key='col11'/>
            <Column title='col12' width={120} key='col12'/>
            <Column title='col13' width={120} key='col13'/>
            <Column title='col14' width={120} key='col14'/>
        </Table>
    )
}

```

## API 

### Column 列的属性信息

| 属性       | 说明                     | 类型                   | 默认值
|-----      |------                   |------                 |------------
|title      |显示的表格 title 信息       | `string`             | -
|align      |设置列的对齐方式            | `'left'` \| `'right'` \| `'center'` | -
|width      |表格的宽度信息              | `number`              | -
|children   |如果有节点,则表示当期列是分组的 | `ReactNode`          |-
|fixed      |固定列值为固定列的方向        | `'left'` \| `'right'` | -
|render     |自定义渲染单元格             |`(text: string, record: Object, index: number) => ReactNode`| -

如果要进行表格头部分组

```jsx

// 如需要则可以按照这个方式嵌套下去
function demo() {
    return (
        <Table>
            <Column title='性别'>
                <Column title='男' />
                <Column title='女'/>
            </Column>
            <Column title='基础信息'>
                <Column title='人员名称' />
                <Column title='身份证'/>
            </Column>
        </Table>
    )
}
```