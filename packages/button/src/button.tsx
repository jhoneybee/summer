import React, { forwardRef, HTMLAttributes, useState } from 'react';
import { StyledButton } from './styled/button';

const ohterTypes = ['text'];
const mappingType: Array<'a'> = ['a'];
  
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

export const Button = forwardRef(({
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
