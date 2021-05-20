import React, { ReactNode } from 'react';

import Draggable from 'react-draggable';


import { Button } from '@summer/button';
import { Space } from '@summer/space';


import {
    RootStyled,
    MaskStyled,
    ModalStyled,
    ModalHeader,
    ModalTitle,
    ModalBody,
    ModalFooter,
    CloseIconStyled
} from './styled'

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
                                onChangeVisible?.(false);
                            }}
                        />
                    </ModalHeader>
                    <ModalBody>
                        {children}
                    </ModalBody>
                    <ModalFooter>
                        <Space>
                            <Button
                                key='cancel'
                                onClick={() => {
                                    onChangeVisible?.(false)
                                }}
                            >
                                取消
                            </Button>
                            <Button
                                key='ok'
                                type='primary'
                            >
                                确定
                            </Button>
                        </Space>
                    </ModalFooter>
                </ModalStyled>
            </Draggable>
        </RootStyled>
    );
} 