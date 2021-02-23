import React, { HTMLAttributes, useState } from 'react';
import styled from 'styled-components';

/**
 * 灵感来源于 https://material.io/components/buttons
 */
const StyledButton = styled.button.attrs((props) => {
})`
    text-align: center;
    overflow: hidden;
    cursor: ${props => props.disabled ? 'default': 'pointer'};
    padding: 4px 15px;
    background-color: ${props => props.disabled ? 'rgba(0, 0, 0, 0.12)' : '#6200ee'} ;
    height: 32px;
    border-radius: 2px;
    transition: box-shadow 400ms;
    border: none;
    color: ${props => props.disabled ? 'rgba(0, 0, 0, 0.26)' : '#fff'};
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};
    font-weight: 500;
    font-size: .875rem;
    box-shadow: ${props => props.disabled ? 'none' : 'rgba(0, 0, 0, 0.12)'};
    :hover{
        box-shadow: 0px 2px 4px rgba(0,0,0,.4);
    }
    :active {
        box-shadow: 0px 4px 12px rgba(0,0,0,.4);
    }
`;

// 按钮的属性信息
export interface ButtonProps extends Omit<
    HTMLAttributes<HTMLElement>,
    'onClick' | 'inputMode'
> {
    // 设置为危险按钮
    danger: boolean
    // 设置按钮是否失效
    disabled: boolean
    // 设置为幽灵按钮
    ghost: boolean
    // 要跳转的地址
    href: string
    // 按钮类型
    type: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default';
    // 点击事件
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | Promise<void>
}

export default function Button ({
    danger = false,
    disabled = false,
    ghost = false,
    href,
    type,
    onClick,
    ...restProps
}: ButtonProps) {
    const [isDisabled, setDisabled] = useState(disabled);
    if (href) {
        let realHref = href;
        if (href.includes('->')) {
            realHref = href.split('->')[1];
        }
        return (
            <StyledButton as="a" href="/" {...restProps}/>
        )
    }
    return (
        <StyledButton
            {...restProps}
            disabled={isDisabled}
            onClick={(e) => {
                setDisabled(true);
                const result = onClick?.(e);
                if (result) {
                    result.then(() => {
                        setDisabled(false);
                    })
                }else {
                    setDisabled(false);
                } 
            }}
        />
    );
}