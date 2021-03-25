import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import {
    AiOutlineClose
} from 'react-icons/ai';


const RootStyled = styled.div.attrs(props => {
})`
    display: ${props => props.visible ? 'block' : 'none'};
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
`

/** 遮挡框, 也就是弹出框的背景信息 */
const MaskStyled = styled.div.attrs(props => {
})`
    display: ${props => props.visible ? 'block' : 'none'};
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    z-index: 1000;
    background-color: rgba(0,0,0,.45);
`

/** 弹出框的主体部分 */
const ModalStyled = styled.div.attrs(props => {
})`
    display: ${props => props.visible ? 'block' : 'none'};
    position: relative;
    z-index: 1001;
    width: 520px;
    min-height: 200px;
    top: 100px;
    margin: 0 auto;
    background-color: #fff;
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
`

/** 弹出框的主题 Header 头部信息 */
const ModalHeader = styled.div.attrs(props => {
})`
    display: flex;
    width: 100%;
    height: 3em;
    align-items: center;
    padding-left: 1.5em;
    border-radius: 2px;
    border-bottom: 1px solid #f0f0f0;
`

/** 弹出框的 title 信息 */
const ModalTitle = styled.span`
    width: calc(100% - 55px);
`

/** 弹出框的 body 信息 */
const ModalBody = styled.div`
    margin: 1em;
`

const CloseIconStyled = styled(AiOutlineClose)`
    cursor: pointer;
    width: 55px;
`

export interface ModalProps extends Omit<HTMLDivElement, 'title'> {
    /** 标题信息 */
    title: ReactNode
    /** 对话框是否可见 */
    visible: boolean
    /** 关闭的时候销毁对话框 */
    desfalsetroyOnClose: boolean
    /** 改变用户显示的时候触发的事件 */
    onChangeVisible: (visible: boolean) => void
}

/**
 * 模态对话框。
 */
export default function Modal ({
    title,
    visible = false,
    children,
    desfalsetroyOnClose = false,
    onChangeVisible
}: ModalProps) {
    if (desfalsetroyOnClose && !visible) return null;

    return (
        <RootStyled
            visible={visible}
        >
            <MaskStyled
                visible={visible}
                onClick={() => {
                    onChangeVisible?.(false)
                }}
            />

            <Draggable>
                <ModalStyled
                    visible={visible}
                >
                    <ModalHeader>
                        <ModalTitle>
                            {title}
                        </ModalTitle>
                        <CloseIconStyled
                            onClick={() => {
                                onChangeVisible?.(false) 
                            }}
                        />
                    </ModalHeader>
                    <ModalBody>
                        {children}
                    </ModalBody>
                </ModalStyled>
            </Draggable>
        </RootStyled>
    );
} 