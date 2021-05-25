import React, { cloneElement, forwardRef, HTMLAttributes, ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { DropDownStyled } from './styled'

interface DropDownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    children: JSX.Element
    overlay?: ReactNode
    visible?: boolean
    onChange?: (changeVisible: boolean) => void
}

export const DropDown = forwardRef<HTMLDivElement, DropDownProps>(({
    style = {},
    overlay,
    visible = false,
    children,
}, ref) => {
    const childrenRef = useRef<HTMLElement>()

    /** 获取子节点的引用 */
    const dom = cloneElement(children, {
        ...children.props,
        key: children.props.key,
        innerRef: (refDom: HTMLElement) => {
            const restProps = children.props
            if (refDom instanceof HTMLElement) {
                childrenRef.current = refDom;
                if (restProps.ref instanceof Function) {
                    restProps.ref?.(childrenRef.current);
                }else if(restProps.ref){
                    restProps.ref.current = childrenRef.current;
                }
            }
        }
    })

    return (
        <>
            {dom}
            <DropDownStyled
                ref={ref}
                style={{
                    ...style,
                    display: visible ? 'unset' : 'none',
                }}
            >
                {overlay}
            </DropDownStyled>
           
        </>
    )
})