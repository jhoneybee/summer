---
id: table
title: Table 表格
sidebar_label: Table 表格
slug: /table
---


```jsx live
/**
 * title: 基础
 * desc: 基础表格演示, 也可以对 Column 进行 style 的颜色设置
 **/
function simple () {

    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        const data = []
        for (let row=0; row< 1000; row += 1) {
            const cells = []

            for (let col = 0; col< 1000; col++) {
                cells.push({
                    value: `col-${row}-${col}`,
                    name: `col${col}`
                })
            }
            data.push({
                cells
            })
        }
        setDataSource(data);
    }, [])

    const columns = []

    for (let i=0; i< 100; i++) {
        columns.push((
            <Column
                key={`col${i}`}
                name={`col${i}`}
                title={`col${i}`}
                width={120}    
                editor={({ value, onChange }, end) => (
                    <Input
                        value={value}
                        onBlur={() => { end() }}
                        onChange={e => {
                            onChange(e.target.value);
                        }}
                    />
                )}
            />
        ))
    }

    return (
        <Table
            dataSource={dataSource}
            rowStyle={(rowIndex) => {
                if (rowIndex === 0) {
                    return {
                        'color': 'red'
                    }
                }
                return {};
            }}
            onChange={setDataSource}
        >
            {columns}
        </Table>
    )
}
```

```jsx live
/**
 * title: 表头分组
 * desc: 进行表格分组归纳方便查看
 **/
function simple () {

    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        const data = []
        for (let i=0; i< 10000; i += 1) {
            data.push({
                    cells: [{
                        value: '这是一个非常非常非常长的文本内容',
                        name: 'col0',
                    },{
                        value: `col-${i}`,
                        name: 'col1',
                    },{
                        value: `col-${i}`,
                        name: 'col2',
                    },{
                        value: `col-${i}`,
                        name: 'col3',
                    },{
                        value: `col-${i}`,
                        name: 'col4',
                    },{
                        value: `col-${i}`,
                        name: 'col5',
                    },{
                        value: `col-${i}`,
                        name: 'col6',
                    },{
                        value: `col-${i}`,
                        name: 'col7',
                    },{
                        value: `col-${i}`,
                        name: 'col8',
                    },{
                        value: `col-${i}`,
                        name: 'col9',
                    },{
                        value: `col-${i}`,
                        name: 'col10',
                    },{
                        value: `col-${i}`,
                        name: 'col11',
                    },{
                        value: `col-${i}`,
                        name: 'col12',
                    },{
                        value: `col-${i}`,
                        name: 'col13',
                    },{
                        value: `col-${i}`,
                        name: 'col14',
                    }]
                })
        }
        setDataSource(data);
    }, [])

    return (
        <>
            <Table
                dataSource={dataSource}
            >
                <Column title='姓名' align='center' key='col0' name='col0'/>
                <Column title='个人资料' key='info'>
                    <Column title='家庭地址信息' key='home-info'>
                        <Column title='省' key='col1' name='col1'/>
                        <Column title='市' key='col2' name='col2'/>
                        <Column title='区' key='col3' name='col3'/>
                        <Column title='详细地址' key='col4' name='col4'/>
                    </Column>
                    <Column title='公司地址' key='job-info'>
                        <Column title='省' key='col6' name='col6'/>
                        <Column title='市' key='col7' name='col7'/>
                        <Column title='区' key='col8' name='col8'/>
                        <Column title='详细地址' key='col9' name='col9'/>
                    </Column>
                </Column>
            </Table>
        </>
    )
}
```

```jsx live
/**
 * title: 固定列
 * desc: 对表格进行列的固定, 如果表格头部进行合并了, 那么固定列只能固定第一层
 **/
function simple () {

    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        const data = []
        for (let i=0; i< 10000; i += 1) {
            data.push({
                    cells: [{
                        value: '这是一个非常非常非常长的文本内容',
                        name: 'col0',
                    },{
                        value: `col-${i}`,
                        name: 'col1',
                    },{
                        value: `col-${i}`,
                        name: 'col2',
                    },{
                        value: `col-${i}`,
                        name: 'col3',
                    },{
                        value: `col-${i}`,
                        name: 'col4',
                    },{
                        value: `col-${i}`,
                        name: 'col5',
                    },{
                        value: `col-${i}`,
                        name: 'col6',
                    },{
                        value: `col-${i}`,
                        name: 'col7',
                    },{
                        value: `col-${i}`,
                        name: 'col8',
                    },{
                        value: `col-${i}`,
                        name: 'col9',
                    },{
                        value: `col-${i}`,
                        name: 'col10',
                    },{
                        value: `col-${i}`,
                        name: 'col11',
                    },{
                        value: `col-${i}`,
                        name: 'col12',
                    },{
                        value: `col-${i}`,
                        name: 'col13',
                    },{
                        value: `col-${i}`,
                        name: 'col14',
                    }]
                })
        }
        setDataSource(data);
    }, [])

    return (
        <Table
            dataSource={dataSource}
        >
            <Column title='姓名' fixed='left' align='center' name='col0' key='col0'/>
            <Column title='个人资料' key='info'>
                <Column title='家庭地址信息' key='home-info'>
                    <Column title='省' key='col1' name='col1'/>
                    <Column title='市' key='col2' name='col2'/>
                    <Column title='区' key='col3' name='col3'/>
                    <Column title='详细地址' key='col4' name='col4'/>
                </Column>
                <Column title='公司地址' key='job-info'>
                    <Column title='省' key='col6' name='col6'/>
                    <Column title='市' key='col7' name='col7'/>
                    <Column title='区' key='col8' name='col8'/>
                    <Column title='详细地址' key='col9' name='col9'/>
                </Column>
            </Column>
            <Column title='操作' fixed='right' key='col12' name='col12' />
        </Table>
    )
}
```




## API 


### Table 的属性信息

| 属性       | 说明                     | 类型                   | 默认值
|-----      |------                   |------                 |------------
|width      | 表格的宽度                | `number`              | `1000`
|height     | 表格的高度                | `number`              | `400`
|dataSource | 数据源信息                | `Array<DataRow>`      | - 
|children   | JSX风格的列信息            | `Column[]` \| `Column`          | -
|rowStyle   | 定义当前行的样式信息         | `(rowIndex: number, cell: DataCell) => CSSProperties` | -

### Column 列的属性信息

| 属性       | 说明                     | 类型                   | 默认值
|-----      |------                   |------                 |------------
|title      |显示的表格 title 信息       | `string`             | -
|align      |设置列的对齐方式            | `'left'` \| `'right'` \| `'center'` | -
|children   |如果有节点,则表示当期列是分组的 | `Column[]`  \| `Column`         |-
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