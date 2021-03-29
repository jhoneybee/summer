import React, { isValidElement, ReactNode, forwardRef, useMemo, useRef, HTMLAttributes, useEffect } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import styled, { CSSProperties } from 'styled-components';

import AutoSize from './autosize';

type Align = 'left' | 'right' | 'center';

/**
 * 单元格的数据结构
 */
type DataCell = {
    /** 单元格的对其方式 */
    align?: Align
    /** 值信息 */
    value?: string | number | boolean
    /** 表示匹配到 col 的 key*/
    name?: string
    /** 合并列的信息 */
    colSpan?: number
    /** 表格行的信息合并 */
    rowSpan?: number
}

/**
 * 行的数据结构
 */
type DataRow = {
    /** 单元格 */
    cells: DataCell[]
}



/** 单元格样式 */
const CellStyled = styled.div`
    padding: 10px;
    border-bottom: 1px solid #f0f0f0;
`

/** 列的头部信息 */
const ColumnHeader = styled.div`
    overflow-x: hidden;
    white-space: nowrap;
    background: #fafafa;
    border-bottom: 1px solid #f0f0f0;
    border-top: 1px solid #f0f0f0;
    font-weight: 500;
`

/** 表格的列信息 */
const ColumnStyled = styled.div.attrs(props => {
})`
    display: inline-block;
    text-align: ${props => props.align};
    width: ${props => props.width};
    background: #fafafa;
    padding: ${props => props.isGroup ? '0px': '10px'};
    white-space: nowrap;
    border-top: 1px solid #f0f0f0;
`



/** 列的 title 样式 */
const ColumnTitle = styled.div.attrs(props => {
})`
    text-align: ${props => props.align};
    padding: ${props => props.isGroup ? '10px 0px': '10px'};
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
    border-top: 1px solid #f0f0f0;
    border-left: 1px solid #f0f0f0;
`

export interface ColumnProps {
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
    align = 'left',
    children,
    width = 120,
    fixed
}: ColumnProps) => {
    if (children) {
        return (
            <GroupColumnStyled>
                <ColumnTitle
                    align={align || 'center'}
                >
                    {title}
                </ColumnTitle>
                {children}
            </GroupColumnStyled>
        )
    } 
    return (
        <ColumnStyled
            width={`${width}px`}
        >
            <ColumnTitle
                align={align}
            >
                {title}
            </ColumnTitle>
        </ColumnStyled>
    )
}

export interface CellProps {
    style: CSSProperties
    cell: DataCell
}

/** 当期表格的单元格信息 */
const Cell = ({
    cell,
    style,
}: CellProps) => {
    return (
        <CellStyled
            style={style}
        >
            {cell?.value}
        </CellStyled>
    );
}


/** 表格的配置信息 */
export interface TableProps {
    /** 宽度 */
    width: number;
    /** 高度 */
    height: number
    /** 子节点信息 */
    children: ReactNode
    /** 数据源信息 */
    dataSource: Array<DataRow>
}

type DataColumn = {
    key: string | number
    width?: number
    render?:  (cell: DataCell, row: DataRow, rowIndex: number) => ReactNode
    children?: DataColumn[]
    /** 要合并的列信息 */
    colSpan?: number
    /** 要合并的行信息 */
    rowSpan?: number
}


const useColDataBottom = (children: ReactNode) => {
    const cols: DataColumn[] = useMemo(() => {

        const getColumnHeaderBottom = (element: JSX.Element[]): DataColumn[] => {
            const dataCols: DataColumn[] = [];
            element.forEach(child => {
                if (child.props.children) {
                    dataCols.push(...getColumnHeaderBottom(child.props.children))
                } else {
                    dataCols.push({
                        key: child.key,
                        width: child.props.width || 120,
                        render: child.props.render
                    })
                }
            })
            return dataCols;
        }

        if (children instanceof Array ) {
            return getColumnHeaderBottom(children as JSX.Element[])
        }
        return getColumnHeaderBottom([children] as JSX.Element[]);
    }, [children])
    return cols;
}

interface TableHeaderProps extends HTMLAttributes<HTMLDivElement>{
    width: number
}

/** 表格的头部信息 */
const TableHeader = forwardRef<HTMLDivElement, TableHeaderProps>(({
    width,
    children
}: TableHeaderProps, ref) => {
    return (
        <ColumnHeader
            ref={ref}
            style={{
                width,
            }}
        >
            {children}
        </ColumnHeader>
    )
})


/** 表格组件 */
export default function Table({
    children,
    width = 1000,
    height = 400,
    dataSource = []
}: TableProps) {

    const headerRef = useRef<HTMLDivElement>(null);

    const cols: DataColumn[] = useColDataBottom(children)

    useEffect(() => {
        console.log('cols',cols)
    }, [])

    let estimatedColumnWidth = 0;

    cols.forEach(({
        width,
    }) => {
        estimatedColumnWidth +=  width;
    })

    return (
        <>
            <TableHeader
                ref={headerRef}
                width={width}
            >
                {children}
            </TableHeader>
            <Grid
                width={width}
                height={height}
                columnCount={cols.length}
                columnWidth={(index) => cols[index].width}
                rowHeight={() => 44}
                estimatedColumnWidth={estimatedColumnWidth / cols.length}
                rowCount={dataSource.length}
                onScroll={({
                    scrollTop,
                    scrollLeft
                }) => {
                    headerRef.current?.scrollTo({
                        top: scrollTop,
                        left: scrollLeft
                    })
                }}
            >
                {({ style, rowIndex, columnIndex }) => {
                    const row = dataSource[rowIndex];
                    const cell = row.cells.find(ele => ele.name === cols[columnIndex].key);
                    const render = cols[columnIndex].render;

                    const cellElement = (
                        <Cell
                            style={style}
                            key={`row-${rowIndex}col-${columnIndex}`}
                            cell={cell}
                        />
                    )

                    if (render) {
                        return (
                            <>
                                {render(cell, row, rowIndex)}
                            </>
                        );
                    }
                    return cellElement
                }}
            </Grid>
       </>
    );
}