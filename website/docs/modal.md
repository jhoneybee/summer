---
id: modal
title: Modal 对话框
sidebar_label: Modal 对话框
slug: /modal
---


```jsx live
/**
 * title: 基础
 * desc: 基础的对话框
 **/
function simple () {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <Button
                onClick={() => {
                    setVisible(true)
                }}
            >
                点击按钮显示弹出框
            </Button>
            <Modal
                visible={visible}
                title="标题信息"
                onChangeVisible={setVisible}
            >
                <Input />
            </Modal>
        </>
    )
}
```

## API 

| 属性       | 说明                     | 类型                   | 默认值
|-----      |------                   |------                 |------------
|visible    | 对话框是否可见            | `boolean`             | `false`
|width      | 宽度                    | `string` \| `number`    | 520
|desfalsetroyOnClose | 关闭时销毁 Modal 里的子元素 | `boolean`          | `false`    