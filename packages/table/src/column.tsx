import React, { HTMLAttributes, ReactNode, useRef } from 'react';
import styled from 'styled-components';

import { Resizable } from 're-resizable';

import { Align, DataCell, EditorType, DataRow } from './type';

/** 表格的列信息 */
const ColumnStyled = styled(Resizable)`
    display: inline-flex;
    background: #fafafa;
    white-space: nowrap;
    align-items: center;
    flex-shrink:0;
    border-right: 1px solid #ddd;
    height: 100%;
    box-sizing: border-box;
`

/** 列的 title 样式 */
const ColumnTitle = styled.div.attrs(props => {
})`
    text-align: ${props => props.align};
    height: 35px;
    line-height: 35px;
    padding: 0 8px;
    width: 100%;
`;

/** 分组的表格头部样式 */
const GroupColumnStyled = styled.div.attrs(props => {
})`
    display: inline-block;
    text-align: ${props => props.align};
    width: ${props => props.width};
    background: #fafafa;
    padding: 0px;
    white-space: nowrap;
    box-sizing: border-box;
`

const GroupColumnTitle = styled.div.attrs(props => {
})`
    text-align: ${props => props.align};
    height: 35px;
    line-height: 35px;
    padding: 0 8px;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
`;

export interface ColumnProps extends HTMLAttributes<HTMLDivElement>{
    /** 显示的表格 title 信息 */
    title: string
    /** 设置列的对齐方式 */
    align?: Align
    /** 表格的宽度信息 */
    width?: number
    /** 组件名称 */
    name: string
    /** 头下的子节点信息 */
    children?: ReactNode
    /** 固定列值为固定列的方向 */
    fixed?: 'left' | 'right'
    /** 自定义渲染单元格 */
    render?:  (cell: DataCell, row: DataRow, rowIndex: number) => ReactNode
    /** 编辑器 */
    editor?: (info: EditorType, end: () => void) => ReactNode
    /** 改变列大小触发的事件 */
    onResize?: (width: number, name: string) => void
    onResizeStop?: (width: number, name: string) => void
}

/** 表格列的信息 */
export const Column = ({
    title,
    align,
    children,
    width = 120,
    fixed,
    name,
    onResize,
    onResizeStop,
    ...restProps
}: ColumnProps) => {

    const realWidth = useRef<number>(width)

    if (children) {
        return (
            <GroupColumnStyled
                {...restProps}
            >
                <GroupColumnTitle
                    align={align || 'center'}
                >
                    {title}
                </GroupColumnTitle>
                {children}
            </GroupColumnStyled>
        )
    } 

    let resizable = true;

    if (fixed) {
        resizable = false;
    }

    return (
        <ColumnStyled
            defaultSize={{
                width,
                height: 'auto'
            }}
            enable={{
                right: resizable
            }}
            onResize={(event, direction, elementRef, delta) => {
                onResize?.(realWidth.current + delta.width, name)
            }}
            onResizeStop={(event, direction, elementRef, delta) => {
                realWidth.current += delta.width
            }}
        >
            <ColumnTitle
                align={align || 'left'}
            >
                {title}
            </ColumnTitle>
        </ColumnStyled>
    )
}
