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
                            debugger
                            re([{
                                title: '子节点',
                                key: 'childKey',
                                children: [],
                            }]);
                        }, 1000)
                    });
                }}
                titleRender={(node, data) => {
                    const style = {};
                    if (data.key === 'childKey') {
                        style.color = 'red';
                    }
                    return cloneElement(node, {
                        ...node.props,
                        style: {
                            ...(node.props.style || {}),
                            ...style
                        },
                    })
                }}
                onChangeTreeData={setTreeData}
            />
        </>
    )
}

```

```jsx live
/**
 * title: 可拖拽树
 * desc: 对节点进行拖放, 可通过 processDragDropTreeNode 的方法来进行计算节点的交换
 **/
function simple () {

    const [treeData, setTreeData] = useState([{
        title: '节点一',
        key: 'node-1',
        children: [{
            title: '子节点一',
            key: 'node-1-1',
        }, {
            title: '子节点二',
            draggable: false,
            key: 'node-1-2',
        }, {
            title: '子节点三',
            key: 'node-1-3',
        }],
    }])

    const [expandedKeys, setExpandedKeys] = useState(['node-1'])
    const [checkedKeys, setCheckedKeys] = useState([]);
    return (
        <>
            <Tree
                draggable
                checkable
                expandedKeys={expandedKeys}
                treeData={treeData}
                checkedKeys={checkedKeys}
                onChange={setTreeData}
                onDrop={(source, target, dropState) => {
                    const newData = processDragDropTreeNode(treeData, source, target, dropState);
                    setTreeData(newData);
                }}
                onCheck={(checks) => {
                    setCheckedKeys(checks)
                }}
                onExpand={({ expandedKeys })=> {
                    setExpandedKeys(expandedKeys)
                }}
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
|checkable    | 节点前添加 Checkbox 复选框       | `boolean`  | `false`
|overlay      | 右键弹出的信息          | `ReactNode` | -
|loadData | 异步加载数据                       | `(node: NodeData) => Promise<Array<DataNode>>` | -
|nodeRender | 自定义node节点                   | `(node: JSX.Element, data: DataNode) => JSX.Element` | -
|titleRender | 自定义title 渲染                | `(node: JSX.Element, data: DataNode) => JSX.Element` | -
|iconRender  | 自定义icon 渲染                 | `(node: JSX.Element, data: DataNode) => JSX.Element` | -
|onExpand | 节点展开的事件                      | `(expandedKeys: ExpandParam) => void` | - 
|onDrop   | 节点拖拽事件                        | `(sourceNode, targetNode, dropState) => void` | -

### DataNode


| 属性                   | 说明                | 类型                    | 默认值
|--------                |-----------         |-------------           |---------------
|title                   | 节点标题信息         | `string`                | -
|key                     | 唯一的标识           | `number` \| `string`    | - 
|loadState               | 加载状态             | `'await'` \| `'finish'` | -
|children                | 子节点信息           | `DataNode[]` \| `'lazy'` | -
|level                   | 层级信息             | `number`                 | -
|checked               | 是否选中             | `boolean`  | `false`
|isLeaf                  | 是否是独立的节点信息, 也就是不包含子节点本上不会展开 | `boolean` | -


> 可以通过 `findTreeNode` 方法来重新设置节点的信息, 以及添加删除和更新节点


## FAQ 常用问题 

#### 该如何设置拖拽的时候部分节点可不拖拽? 

初始话数据的时候的时候,可以设置单个节点的 `draggable` 属性.