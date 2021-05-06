import React, { cloneElement, forwardRef, HTMLAttributes, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DropDownStyled } from './styled'

interface DropDownProps extends HTMLAttributes<HTMLDivElement> {
    children: JSX.Element,
    overlay?: ReactNode,
    visible?: boolean
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
        ref: (refDom: HTMLElement) => {
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

    const [width, setWidth] = useState<number>(0);

    useLayoutEffect(() => {
        if (childrenRef.current) {
            setWidth(childrenRef.current.getBoundingClientRect().width)
        }
    }, [])

    return (
        <>
            {dom}
            <DropDownStyled
                ref={ref}
                style={{
                    ...style,
                    visibility: visible ? 'visible' : 'hidden',
                    width,
                }}
            >
                {overlay}
            </DropDownStyled>
           
        </>
    )
})