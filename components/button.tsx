import React, { forwardRef, HTMLAttributes, useState } from 'react';
import styled from 'styled-components';
import {
    primaryColor,
    fontColor,
    disabled,
    fontDeepColor,
    dangerColor,
} from './styles/global';

const ohterTypes = ['text'];
const mappingType: Array<'a'> = ['a'];

// 按钮的背景色
const buttonBackgroundColor = props => {

    // 危险的背景颜色
    if (props.danger && props.btype !== 'text') {
        return dangerColor(props);
    }

    // 主要按钮的背景颜色
    if (props.btype === 'primary') {
        return primaryColor(props);
    }
    // 默认按钮背景颜色
    return '#fff';
}

// 按钮的字体颜色
const buttonColor = (props) => {
    if (props.btype === 'default' && !props.danger) {
        return fontColor(props);
    }

    if (props.danger && props.btype === 'text') {
        return dangerColor(props);
    }

    if (props.btype === 'text') {
        return fontColor(props);
    }
    return fontDeepColor(props);
}

// 按钮的阴影
const boxShadow = (props) => {
    if (props.disabled) {
        return  'none'
    }
    if (props.btype === 'text') {
        return 'none';
    }
    if (props.btype === 'default' && !props.danger) {
        return '0px 1px 1px rgba(0, 0, 0, 0.05)';
    }
    return '0px 1px 4px rgba(0, 0, 0, 0.15)';
}

// 鼠标移动到按钮上的阴影效果
const hoveBoxShadow = (props) => {
    if (ohterTypes.includes(props.btype)) {
        return 'none';
    }

    if (props.btype === 'default' && !props.danger) {
        return '0px 1px 4px rgba(0,0,0, .1)';
    }
    return '0px 1px 4px rgba(0,0,0, .4)';
}

// 设置点击的阴影
const activeBoxShadow = (props) => {
    if (ohterTypes.includes(props.btype)) {
        return 'none';
    }
    return 'none';
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
    position: relative;
    overflow: hidden;
    text-decoration:none;
    vertical-align: middle;
    padding: 4px 15px;
    height: 32px;
    margin: 4px;
    transition: box-shadow 200ms, color 200ms;
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};
    font-weight: 500;
    font-size: .875rem;
    box-shadow: ${boxShadow};
    ${props => props.disabled ? disabled : null}
    :hover{
        box-shadow: ${hoveBoxShadow};
        color: ${buttonColor};
        text-decoration: none;
    }
    :active {
        box-shadow: ${activeBoxShadow};
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
    block?: boolean
    // 设置为危险按钮
    danger?: boolean
    // 设置按钮是否失效
    disabled?: boolean
    // 要跳转的地址
    href?: string
    // 按钮类型
    type?: 'primary' | 'text' | 'default';
    // 点击事件
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | Promise<void>
}

const Button  = forwardRef(({
    block = false,
    danger = false,
    disabled = false,
    href,
    type = 'default',
    onClick,
    children,
    ...restProps
}: ButtonProps, ref) => {
    const [isDisabled, setDisabled] = useState(disabled);
    const otherIndex = ohterTypes.indexOf(type);
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
                ref={ref}
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
            ref={ref}
            as={mappingType[otherIndex]}
            block={block}
            btype={type}
            disabled={isDisabled}
            danger={danger}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
        </StyledButton>
    );
})

export default Button;
