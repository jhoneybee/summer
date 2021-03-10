---
id: message
title: Message 全局提示
sidebar_label: Message 全局提示
slug: /message
---

全局展示操作反馈信息。

## 何时使用

- 可提供成功、警告和错误等反馈信息。
- 顶部居中显示并自动消失，是一种不打断用户操作的轻量级提示方式。


```jsx live
function simple () {
    return (
        <>
            <Button
                onClick={() => {
                    info('这是一个info信息', 10 * 1000);
                }}
            >
                点击显示Info信息
            </Button>

            <Button
                onClick={() => {
                    error('这是一个error信息');
                }}
            >
                点击显示Error信息
            </Button>
        </>
    )
}

```

### 开发预览

```jsx live
/**
 * title: 开发
 * desc: 这是在开发中, 来验证基础样式的信息, 所以它不会关闭
 **/
function simple () {
    return (
        <>
            <Message type='success' > 这是一个成功信息 </Message>
            <br />
            <Message type='info' > 这是一个提示消息 </Message>
            <br />
            <Message type='warn' > 这是一个警告信息 </Message>
            <br />
            <Message type='error' > 这是一个错误信息 </Message>
            <br />
            <Message type='loading' > 这是一个加载信息 </Message>
        </>
    )
}

```

## API 

| 属性       | 说明                     | 类型                   | 默认值
|-----      |------                   |------                 |------------
|type      | 消息的类型信息             |  `'success'` \| `'error'` \| `'info'` \| `'warn'` \| `'loading'` | - 
|animation | 动画                      | `Keyframes`           | -
|onClose   | 消息关闭的时候触发的事件     | `() => void`          | -

组件提供了一些静态方法，使用方式和参数如下：

- message.show(type, content, duration, isShowCloseIcon, onClose)
- message.success(content, [duration], onClose)
- message.error(content, [duration], onClose)
- message.info(content, [duration], onClose)
- message.warn(content, [duration], onClose)
- message.loading(content, [duration], onClose)
