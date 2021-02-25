/**
 *  TODO 任务完成进度
 * 
 *  - [x] block 属性,和父元素同宽
 *  - [x] disabled 属性,按钮失效
 *  - [-] danger 属性,将按钮设置为危险标识
 *      - [x] primary
 *      - [x] default
 *      - [ ] dashed
 *      - [ ] link
 *      - [ ] text
 *  - [ ] ghost 设置幽灵按钮
 *  - [x] href 设置跳转的地址
 *  - [-] type 设置按钮类型
*       - [x] primary
 *      - [x] default
 *      - [ ] dashed
 *      - [ ] link
 *      - [ ] text
 *  - [x] onClick 按钮的可点击
 */

import React, { HTMLAttributes, useState } from 'react';
import styled from 'styled-components';

// 按钮的背景色
const buttonBackgroundColor = props => {
    // 禁用后按钮的背景颜色
    if (props.disabled) {
        return 'rgba(0, 0, 0, 0.12)';
    }
    // 危险的背景颜色
    if (props.danger) {
        return '#ff4d4f';
    }
    // 主要按钮的背景颜色
    if (props.btype === 'primary') {
        return '#6002ee';
    }
    // 默认按钮背景颜色
    return '#fff';
}

// 按钮的字体颜色
const buttonColor = (props) => {
    if (props.disabled) {
        return 'rgba(0, 0, 0, 0.26)';
    }
    if (props.btype === 'default' && !props.danger) {
        return 'rgba(0,0,0,.85)'
    }
    return  'rgba(255,255,255,.85)';
}

// 按钮的阴影
const boxShadow = (props) => {
    if (props.disabled) {
        return 'none';
    }

    if (props.btype === 'default' && !props.danger) {
        return '0px 1px 1px rgba(0, 0, 0, 0.05)';
    }
    return '0px 1px 4px rgba(0, 0, 0, 0.15)';
}

// 鼠标移动到按钮上的阴影效果
const hoveBoxShadow = (props) => {
    if (props.btype === 'default' && !props.danger) {
        return '0px 2px 6px rgba(0,0,0, .1)';
    }
    return '0px 2px 6px rgba(0,0,0, .4)';
}

// 鼠标点击后, 按钮上会覆盖一层渐变色的效果
const beforeElementBackgroundImage = (props) => {
    return `
        radial-gradient(
        rgba(255, 255, 255, 0.2) 0px, 
        rgba(255, 255, 255, 0.3) 40%, 
        rgba(255, 255, 255, 0.4) 50%, 
        rgba(255, 255, 255, 0.5) 60%, 
        rgba(255, 255, 255, 0) 70%
    )`;
}

// 按钮的样式信息
const StyledButton = styled.button.attrs((props) => {
})`
    border: ${props => {
        if (props.btype === 'default' && !props.danger) {
            return '1px solid rgba(0, 0, 0, 0.15)';
        }
        return 'none';
    }};
    border-radius: 2px;
    background-color: ${buttonBackgroundColor};
    color: ${buttonColor};
    cursor: ${props => props.disabled ? 'default': 'pointer'};
    display: ${props => props.block ? 'block' : 'inline-block'};
    width: ${props => props.block ? '100%' : 'unset'};
    text-align: center;
    position:relative;
    overflow: hidden;
    text-decoration:none;
    vertical-align: middle;
    padding: 4px 15px;
    height: 32px;
    margin: 4px;
    transition: box-shadow 400ms, color 400ms;
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};
    font-weight: 500;
    font-size: .875rem;
    box-shadow: ${boxShadow};
    :hover{
        box-shadow: ${hoveBoxShadow};
        color: ${buttonColor};
        text-decoration: none;
    }
    :active {
        box-shadow: 0px 4px 10px rgba(0,0,0, .6);
        ::before {
            display: inline;
            transform:  scale(5);
        }
    }
    ::before{
        z-index: 1;
        display: none;
        position: absolute;
        content: ' ';
        left: 0px;
        width: 100%;
        height: 100%;
        background-image: ${beforeElementBackgroundImage};
    }
`;

// 按钮的属性信息
export interface ButtonProps extends Omit<
    HTMLAttributes<HTMLElement>,
    'onClick' | 'inputMode'
> {
    // 设置为和父元素同宽
    block: boolean
    // 设置为危险按钮
    danger: boolean
    // 设置按钮是否失效
    disabled: boolean
    // 设置为幽灵按钮
    ghost: boolean
    // 要跳转的地址
    href: string
    // 按钮类型
    type: 'primary'| 'dashed' | 'link' | 'text' | 'default';
    // 点击事件
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | Promise<void>
}

export default function Button ({
    block = false,
    danger = false,
    disabled = false,
    ghost = false,
    href,
    type = 'default',
    onClick,
    children,
    ...restProps
}: ButtonProps) {
    const [isDisabled, setDisabled] = useState(disabled);
    if (href) {
        let realHref = href;
        let target = '_self';
        if (href.includes('->')) {
            realHref = href.split('->')[1];
            target = href.split('->')[0];
        }
        return (
            <StyledButton
                {...restProps}
                as="a"
                block={block}
                btype={type}
                target={target}
                href={realHref}
                danger={danger}
            >
                {children}
            </StyledButton>
        )
    }
    return (
        <StyledButton
            {...restProps}
            block={block}
            btype={type}
            disabled={isDisabled}
            danger={danger}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
        >
            {children}
        </StyledButton>
    );
}