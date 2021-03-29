import React, { CSSProperties, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';

export type Size = {
    height: number
    width: number
}

export interface AutoSizeProps {
    className?: string
    style?: CSSProperties

    /** 最小的宽度 */
    minWidth?: number

    /** 最小高度 */
    minHeight?: number

    /** 要渲染的元素信息 */
    children: (size: Size) => ReactNode
}

/**
 * 获取父节点的高度信息
 */
export default function AutoSize ({
    className,
    style,
    minWidth = 1000,
    minHeight = 500,
    children
}: AutoSizeProps) {
    const sizeRef = useRef<HTMLDivElement>();

    const [size, setSize] = useState<Size>({
        width: 0,
        height: 0
    });


    const getSize = (dom: HTMLElement) : Size => {
        const height = dom.clientHeight || minHeight;
        const width = dom.clientWidth || minWidth;
        return {
            height,
            width
        }
    }

    useLayoutEffect(() => {
        console.log('size', getSize(sizeRef.current))
    })

    useEffect(() => {
        if (sizeRef.current) {
            const size = getSize(sizeRef.current);
            setSize(size);
        }
    }, []);

    return (
        <div
            ref={sizeRef}
            style={{
                height: size.height,
                width: size.width,
            }}
            className={className}
        >
            {children?.(size)}
        </div>
    )
}