---
id: tabs
title: Tabs 标签页
sidebar_label: Tabs 标签页
slug: /tabs
---


```jsx live
/**
 * title: 基础
 * desc: 基础简单的标签页信息
 **/
function simple () {
    return (
        <>
            <Tabs activeKey={0} >
                <TabPane tab='标签一' key={0}>
                    我是标签一
                </TabPane>
                <TabPane tab='标签二' key={1}>
                    我是标签二
                </TabPane>
            </Tabs>
        </>
    )
}

```

## API 

| 属性       | 说明                     | 类型                   | 默认值
|-----      |------                   |------                 |------------
|activeKey  |当前激活 tab 面板的 key     |`string` \| `number`  | - 
