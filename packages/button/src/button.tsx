import React, { createRef, forwardRef, HTMLAttributes, MutableRefObject, ReactNode } from 'react';
import { StyledButtonPrimary, StyledButtonDefault, IconStyled } from './styled';

  
// 按钮的属性信息
export interface ButtonProps extends Omit<
    HTMLAttributes<HTMLElement>,
    'onClick' | 'inputMode'
> {
    // 设置为危险按钮
    danger?: boolean
    // 设置按钮是否失效
    disabled?: boolean
    // 按钮的图标
    icon?: ReactNode
    // 按钮类型
    type?: 'primary' | 'default'
    // 点击事件
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | Promise<void>
    innerRef?: MutableRefObject<HTMLButtonElement | null>
}

export const Button = ({
    danger = false,
    disabled,
    type = 'default',
    onClick,
    children,
    icon,
    innerRef,
    ...restProps
}: ButtonProps) => {
    let ButtonStyled = StyledButtonDefault
    if (type === 'primary') {
        ButtonStyled = StyledButtonPrimary
    }

    const renderIcon = () => {
        if (icon) {
            return (
                <IconStyled>
                    {icon}
                </IconStyled>
            )
        }
        return null;
    }

    return (
        <ButtonStyled
            {...restProps}
            ref={innerRef}
            disabled={disabled}
            onClick={(e) => {
                onClick?.(e)
            }}
        >
            {renderIcon()}&nbsp;{children}
        </ButtonStyled>
    )
}
