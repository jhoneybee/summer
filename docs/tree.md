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
                title: `${i}-${key}`
            })
        }
        return nodes;
    }

    const treeData = () => {
        const nodes = []
        for(let i=0; i < 100 ; i += 1) {
            nodes.push({
                title: `A-${i}`,
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

## API

| 属性       | 说明                     | 类型                   | 默认值
|-----      |------                   |------                 |------------
