import React, { isValidElement, ReactNode, useMemo, useRef } from 'react';
import { VariableSizeGrid as Grid, GridProps } from 'react-window';
import styled, { CSSProperties } from 'styled-components';

/**
 * 单元格的数据结构
 */
type DataCell = {
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
`

/** 列的头部信息 */
const ColumnHeader = styled.div`
    overflow-x: hidden;
    white-space: nowrap;
`

/** 表格的列信息 */
const ColumnStyled = styled.div.attrs(props => {
})`
    display: inline-block;
    text-align: ${props => props.align};
    width: ${props => props.width};
    background: #fafafa;
    white-space: nowrap;
`

/** 容器信息 */
const ContainerStyled = styled.div.attrs(props => {
})`
`;

const ColumnTitle = styled.div.attrs(props => {
})`
    text-align: ${props => props.align};
`;

export interface ColumnProps {
    /** 显示的表格 title 信息 */
    title: string
    /** 设置列的对齐方式 */
    align?: 'left' | 'right' | 'center'
    /** 表格的宽度信息 */
    width?: number
    /** 头下的子节点信息 */
    children?: ReactNode
    /** 固定列值为固定列的方向 */
    fixed?: 'left' | 'right'
    /** 自定义渲染单元格 */
    render?: (text: string, record: Object, index: number) => ReactNode
}

/** 表格列的信息 */
export const Column = ({
    title,
    align = 'center',
    children,
    width = 120,
    fixed
}: ColumnProps) => {
    let widthStr = '0px';
    if (children) {
        widthStr = "auto";
        return (
            <ColumnStyled
                width={widthStr}
            >
                <ColumnTitle
                    align={align}
                >
                    {title}
                </ColumnTitle>
                {children}
            </ColumnStyled>
        )
    } else {
        widthStr = `${width}px`;
        return (
            <ColumnStyled
                width={widthStr}
                align={align}
            >
                {title}
            </ColumnStyled>
        )
    }
}

export interface CellProps {
    style: CSSProperties
    row: DataRow
    cell: DataCell
}

/** 当期表格的单元格信息 */
const Cell = ({
    row,
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
export interface TableProps extends Omit<GridProps, 'children'> {
    /** 子节点信息 */
    children: ReactNode
    /** 数据源信息 */
    dataSource: Array<DataRow>
}

type DataColumn = {
    key: string | number
    width?: number
}

/** 表格组件 */
export default function Table({
    height = 200,
    width = 500,
    children,
    dataSource = []
}: TableProps) {

    const cols: DataColumn[] = useMemo(() => {
        const colsTemp: DataColumn[] = [];
        /** 获得最下列的信息 */
        const getColumnHeaderBottom = (element: JSX.Element): DataColumn[] => {
            let bottom: DataColumn[] = [];
            if (element.props.children === undefined || element.props.children === null) {
                bottom.push({
                    key: element.key,
                    width: element.props.width || 120
                })
            } else if (element.props.children instanceof Array) {
                element.props.children.forEach(child => {
                    bottom.push(...getColumnHeaderBottom(child));
                })
            } else if (isValidElement(element.props.children)) {
                bottom.push(...getColumnHeaderBottom(element.props.children));
            }
            return bottom;
        }
        /** 计算出来列的信息 */
        if (children instanceof Array) {
            children.forEach((element) => {
                if (isValidElement(element)) {
                    colsTemp.push(...getColumnHeaderBottom(element));
                }
            })
        } else if (isValidElement(children)) {
            colsTemp.push(...getColumnHeaderBottom(children));
        }
        return colsTemp;
    }, [children])

    const headerRef = useRef<HTMLDivElement>(null);

    let estimatedColumnWidth = 0;

    cols.forEach(({
        width
    }) => {
        estimatedColumnWidth += width;
    })

    return (
        <>
            <ContainerStyled
                style={{
                    width,
                }}
            >
                <ColumnHeader
                    ref={headerRef}
                    style={{
                        width,
                    }}
                >
                    {children}
                </ColumnHeader>
            </ContainerStyled>
            <Grid
                width={width}
                height={height}
                columnCount={cols.length}
                columnWidth={(index) => cols[index].width}
                rowHeight={() => 35}
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
                    return (
                        <Cell
                            style={style}
                            key={`row-${rowIndex}col-${columnIndex}`}
                            row={row}
                            cell={cell}
                        />
                    )
                }}
            </Grid>
        </>
    );
}