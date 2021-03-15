---
id: tree
title: Tree 树形控件
sidebar_label: Tree 树形控件
slug: /tree
---


```jsx live
/**
 * title: 大数据测试
 * desc: 基础的树形空间
 **/
function simple () {

    const create100 = (key) => {
        const nodes = []
        for(let i=0; i < 100 ; i += 1) {
            nodes.push({
                title: `${i}-${key}`,
                key: `${i}-${key}-key`
            })
        }
        return nodes;
    }

    const treeData = () => {
        const nodes = []
        for(let i=0; i < 100 ; i += 1) {
            nodes.push({
                title: `A-${i}`,
                 key: `A-${i}-key`,
                children: create100('|'),
            })
        }
        return nodes;
    }
    
    return (
        <>
            <Tree
                treeData={treeData()}
                overlay={
                    <DropDownMenu>
                        <DropDownMenuItem
                            key="0"
                            disabled
                        >
                            跳转到Google
                        </DropDownMenuItem>
                        <DropDownMenuItem key="1">
                            跳转到百度
                        </DropDownMenuItem>
                        <DropDownMenuItem key="2">
                            跳转到首页
                        </DropDownMenuItem>
                    </DropDownMenu>
                }
            />
        </>
    )
}

```

## API

| 属性       | 说明                     | 类型                   | 默认值
|-----      |------                   |------                 |------------
|treeData   |treeNodes 数据, key 需要保持全局唯一| `TreeNodeDataType[]`| `[]`
|expandedKeys | 展开指定的树节点                | `string[]`          | `[]`
|height       | 组件的高度                     | `number`            | -
|draggable    | 设置节点可拖拽                  | `boolean` \| `(node: DataNode) => boolean` | -
|overlay      | 右键弹出的信息覆盖的信息          | `ReactNode` | -
|loadData | 异步加载数据                       | `(node: NodeData) => Promise<Array<DataNode>>` | -