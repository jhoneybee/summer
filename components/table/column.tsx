import React, { HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

import { Align, DataCell, DataRow } from './type';

/** 表格的列信息 */
const ColumnStyled = styled.div.attrs(props => {
})`
    display: inline-flex;
    width: ${props => props.width};
    background: #fafafa;
    white-space: nowrap;
    align-items: center;
    flex-shrink:0;
    border-right: 1px solid #ddd;
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
    /** 头下的子节点信息 */
    children?: ReactNode
    /** 固定列值为固定列的方向 */
    fixed?: 'left' | 'right'
    /** 自定义渲染单元格 */
    render?:  (cell: DataCell, row: DataRow, rowIndex: number) => ReactNode
}

/** 表格列的信息 */
export const Column = ({
    title,
    align,
    children,
    width = 120,
    fixed,
    ...restProps
}: ColumnProps) => {
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
    return (
        <ColumnStyled
            {...restProps}
            width={`${width}px`}
        >
            <ColumnTitle
                align={align || 'left'}
            >
                {title}
            </ColumnTitle>
        </ColumnStyled>
    )
}
