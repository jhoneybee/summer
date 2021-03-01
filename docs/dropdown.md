---
id: dropdown
title: Dropdown 下拉菜单
sidebar_label: Dropdown 下拉菜单
slug: /dropdown
---

向下弹出的列表。

## 何时使用

当页面上的操作命令过多时，用此组件可以收纳操作元素。点击或移入触点，会出现一个下拉菜单。可在列表中进行选择，并执行相应的命令。

- 用于收罗一组命令操作。
- Select 用于选择，而 Dropdown 是命令集合


## 演示


```jsx live
function simple () {
    return (
        <DropDown
            overlay={<a> 查看人员信息 </a>}
        >
            <Button> 测试查看 </Button>
        </DropDown>
    )
}
```



## API 

| 属性       | 说明      | 类型                   | 默认值
|-----      |------     |------                 |------------
|overlay    |菜单        |`ReactNode`            | -
|placement  |菜单弹出位置 | `bottomLeft` \| `bottomCenter` \| `bottomRight` \| `topLeft` \| `topCenter` \| `topRight` \| `bottomLeft`