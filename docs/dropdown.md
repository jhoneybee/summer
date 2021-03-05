---
id: dropdown
title: Dropdown 下拉菜单
sidebar_label: Dropdown 下拉菜单
slug: /dropdown
---

向下弹出的列表。

## 何时使用

当页面上的操作命令过多时，用此组件可以收纳操作元素。点击或移入触点，会出现一个下拉菜单。可在列表中进行选择，并执行相应的命令。


## 演示

```jsx live
/**
 * title: 点击触发
 * desc: 默认为鼠标移动上去即可触发,也可以设置为点击触发
 **/
function simple () {
    return (
        <DropDown
            trigger="click"
            overlay={(
                <DropDownMenu>
                    <DropDownMenuItem key="0" disabled>
                        跳转到Google
                    </DropDownMenuItem>
                    <DropDownMenuItem key="1">
                        跳转到百度
                    </DropDownMenuItem>
                    <DropDownMenuItem key="2">
                        跳转到首页
                    </DropDownMenuItem>
                </DropDownMenu>
            )}
        >
            <Button type="text"> 点击显示... </Button>
        </DropDown>
    )
}
```

```jsx live
/**
 * title: 跟随滚动条
 * desc: 跟谁滚动条的滚动进行位置的变化
 **/
function simple () {
    return (
        <div style={{height: 200, overflow: 'auto'}}>
            <div style={{height: 150}}/>
            <DropDown
                overlay={(
                    <DropDownMenu>
                        <DropDownMenuItem key="0" disabled>
                            跳转到Google
                        </DropDownMenuItem>
                        <DropDownMenuItem key="1">
                            跳转到百度
                        </DropDownMenuItem>
                        <DropDownMenuItem key="2">
                            跳转到首页
                        </DropDownMenuItem>
                    </DropDownMenu>
                )}
            >
                <Button> 测试查看 </Button>
            </DropDown>
            <div style={{height: 2000}}/>
        </div>
    )
}
```



## API 

| 属性       | 说明      | 类型                   | 默认值
|-----      |------     |------                 |------------
|overlay    |菜单        |`ReactNode`            | -
|placement  |菜单弹出位置 | `bottom`  \| `top`     | `bottom`
|visible    |是否可见     | `boolean`              | -
|width      |宽度 `auto` 表示自动宽度,和子组件对其       | `number` \| `auto`     | `auto` 