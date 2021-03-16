---
id: tree
title: Tree 树形控件
sidebar_label: Tree 树形控件
slug: /tree
---


```jsx live
/**
 * title: 高性能
 * desc: 大数据的情况下,采用虚拟滚动来解决 HTML 元素过多的问题
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
            />
        </>
    )
}

```

```jsx live
/**
 * title: 远程服务端 - 懒加载数据
 * desc: 展开节点的时候,才进行数据的加载. 可发送请求惰性加载数据, 减少服务器的压力
 **/
function simple () {

    const [treeData, setTreeData] = useState([{
        title: '节点一',
        key: 'node-1',
        children: 'lazy',
    }])

    return (
        <>
            <Tree
                treeData={treeData}
                loadData={(nodeData) => {
                    return new Promise((re) => {
                        // 模拟网络延迟
                        setTimeout(() => {
                            re([{
                                title: '子节点',
                                key: 'childKey',
                                children: [],
                            }]);
                        }, 3000)
                    });
                }}
                onChange={setTreeData}
            />
        </>
    )
}

```


## API

| 属性       | 说明                     | 类型                   | 默认值
|-----      |------                   |------                 |------------
|treeData   |  节点数据, 注意 key 需要保持全局唯一| `DataNode[]`| `[]`
|expandedKeys | 展开指定的树节点                | `string[]`          | `[]`
|height       | 组件的高度                     | `number`            | -
|draggable    | 设置节点可拖拽                  | `boolean` \| `(node: DataNode) => boolean` | -
|overlay      | 右键弹出的信息          | `ReactNode` | -
|loadData | 异步加载数据                       | `(node: NodeData) => Promise<Array<DataNode>>` | -
|nodeRender | 自定义node节点                   | `ComponentType<TreeNodeProps>` | -
|onExpand | 节点展开的事件                      | `(expandedKeys: ExpandParam) => void` | - 


### DataNode


| 属性                   | 说明                | 类型                    | 默认值
|--------                |-----------         |-------------           |---------------
|title                   | 节点标题信息         | `string`                | -
|key                     | 唯一的标识           | `number` \| `string`    | - 
|loadState               | 加载状态             | `'await'` \| `'finish'` | -
|children                | 子节点信息           | `DataNode[]` \| `'lazy'` | -
|level                   | 层级信息             | `number`                 | -
|isLeaf                  | 是否是独立的节点信息, 也就是不包含子节点本上不会展开 | `boolean` | -