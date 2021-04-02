import React, { ReactNode, forwardRef, useMemo, useRef, HTMLAttributes, CSSProperties } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import styled from 'styled-components';

import { DataCell, DataRow, DataColumn } from './type';
import { CellRender } from './cell';
import { getScrollbarWidth, hoverRender } from './_utils';

const HeaderContainer = styled.div`
    background: #fafafa;
    border-top: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-left: 1px solid #ddd;
`

const GridStyled = styled(Grid)`
    border: 1px solid #ddd;
`

/** 获取真实的列信息, 排除分组头部 */
const useColDataBottom = (children: ReactNode) => {
    const cols: DataColumn[] = useMemo(() => {
        const getColumnHeaderBottom = (element: JSX.Element[]): DataColumn[] => {
            const dataCols: DataColumn[] = [];
            element.forEach(child => {
                if (child.props.children) {
                    if (Array.isArray(child.props.children)) {
                        dataCols.push(...getColumnHeaderBottom(child.props.children))
                    } else {
                        dataCols.push(...getColumnHeaderBottom([child.props.children]))
                    }
                } else {
                    dataCols.push({
                        key: child.key,
                        width: child.props.width || 120,
                        render: child.props.render,
                        fixed: child.props.fixed
                    })
                }
            })
            return dataCols;
        }
        if (Array.isArray(children) ) {
            return getColumnHeaderBottom(children as JSX.Element[])
        }
        return getColumnHeaderBottom([children] as JSX.Element[]);
    }, [children])
    return cols;
}


interface FixedTable {
    /** 节点的 header 信息 */
    children: ReactNode
    /** 数据源信息 */
    dataSource: Array<DataRow>
}

/** 固定列到左边 */
const FixedLeftTable = ({
    children
}: FixedTable) => {
    return (
        <>
            {children}
        </>
    )
}

/** 固定列到右边 */
const FixedRightTable = ({
    children
}: FixedTable) => {
    return (
        <>
            {children}
        </>
    )
}

const TableHeaderStyled = styled.div`
    overflow-x: hidden;
    white-space: nowrap;
    background: #fafafa;
    font-weight: 500;
    display: flex;
    flex-shrink: 0;
`

interface TableHeaderProps extends HTMLAttributes<HTMLDivElement>{
}

/** 表格的头部信息 */
const TableHeader = forwardRef<HTMLDivElement, TableHeaderProps>(({
    children,
    ...restProps
}: TableHeaderProps, ref) => {
    return (
        <TableHeaderStyled
            ref={ref}
            {...restProps}
        >
            {children}
        </TableHeaderStyled>
    )
})

/** 表格的配置信息 */
export interface TableProps extends HTMLAttributes<HTMLDivElement>{
    /** 宽度 */
    width: number;
    /** 高度 */
    height: number
    /** 子节点信息 */
    children: ReactNode
    /** 数据源信息 */
    dataSource: Array<DataRow>
    /** 行的样式信息 */
    rowStyle?: (rowIndex: number, cell: DataCell) => CSSProperties
}

/** 表格组件 */
export default function Table({
    children,
    width = 1000,
    height = 400,
    dataSource = [],
    rowStyle,
    ...restProps
}: TableProps) {

    const headerRef = useRef<HTMLDivElement>();
    const innerRef = useRef<HTMLDivElement>();

    const cols: DataColumn[] = useColDataBottom(children)

    /** 正常的列的信息, 排除固定列 */
    const bodyCols = cols.filter(element => element.fixed === undefined)

    let estimatedColumnWidth = 0;

    cols.forEach(({
        width,
    }) => {
        estimatedColumnWidth +=  width;
    })

    const rowHeight = (index: number) => {
        return 35;
    }

    /** 修复在有滚动条的情况下会产生滚动条的偏差, 导致 Header 和 Body 不对应的问题 */
    const tableHeaderWidth = useMemo(() => {
        let estimatedRowHeight = 0;
        dataSource.forEach((value, index) => {
            estimatedRowHeight += rowHeight(index)
        });

        if (estimatedRowHeight > height) {
            return width - getScrollbarWidth()
        }
        return width;
    }, [dataSource])


    const currentHoverIndex = useRef<number>();

    return (
        <div
            {...restProps}
        >
            <HeaderContainer
                style={{
                    width
                }}
            >
                <TableHeader
                    ref={headerRef}
                    style={{
                        width: tableHeaderWidth - 2,
                    }}
                >
                    {children}
                </TableHeader>
            </HeaderContainer>
            <div
                onMouseLeave={() => {
                    innerRef.current.querySelectorAll(`.summer-cell`).forEach((element: HTMLDivElement) => {
                        element.style.backgroundColor = '';
                    }) 
                }}
            >
                <GridStyled
                    width={width}
                    height={height}
                    columnCount={bodyCols.length}
                    innerRef={innerRef}
                    columnWidth={(index) => bodyCols[index].width}
                    rowHeight={rowHeight}
                    estimatedColumnWidth={estimatedColumnWidth / bodyCols.length}
                    rowCount={dataSource.length}
                    itemData={{
                        rowStyle,
                        dataSource,
                        bodyCols,
                        currentHoverIndex,
                        cols
                    }}
                    onScroll={({
                        scrollTop,
                        scrollLeft
                    }) => {
                        headerRef.current?.scrollTo({
                            top: scrollTop,
                            left: scrollLeft
                        })
                        hoverRender(innerRef.current, currentHoverIndex.current);
                    }}
                >
                    {CellRender}
                </GridStyled>
            </div>
       </div>
    );
}

export { Column } from './column';