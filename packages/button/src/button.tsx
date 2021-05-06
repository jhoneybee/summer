import React, { forwardRef, HTMLAttributes, useState } from 'react';
import { StyledButtonPrimary, StyledButtonDefault } from './styled';

  
// 按钮的属性信息
export interface ButtonProps extends Omit<
    HTMLAttributes<HTMLElement>,
    'onClick' | 'inputMode'
> {
    // 设置为和父元素同宽
    block?: boolean
    // 设置为危险按钮
    danger?: boolean
    // 设置按钮是否失效
    disabled?: boolean
    // 要跳转的地址
    href?: string
    // 按钮类型
    type?: 'primary' | 'default'
    // 点击事件
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | Promise<void>
}

export const Button = forwardRef(({
    block = false,
    danger = false,
    disabled: pDisabled = false,
    href,
    type = 'default',
    onClick,
    children,
    ...restProps
}: ButtonProps, ref) => {
    let ButtonStyled = StyledButtonDefault
    if (type === 'primary') {
        ButtonStyled = StyledButtonPrimary
    }

    const [disabled, setDisabled] = useState<boolean>(pDisabled)

    return (
        <ButtonStyled
            {...restProps}
            disabled={disabled}
            onClick={(e) => {
                setDisabled(true);
                const result = onClick?.(e);
                if (result && result.then) {
                    result.then(() => {
                        setDisabled(false);
                    })
                }else {
                    setDisabled(false);
                } 
            }}
        >
            {children}
        </ButtonStyled>
    )
})
