import React, {
    ReactNode,
    forwardRef,
    useMemo,
    useRef,
    HTMLAttributes,
    CSSProperties,
    isValidElement,
    useState,
    useEffect,
    useLayoutEffect,
    MutableRefObject,
    createRef
} from 'react';
import { GridOnScrollProps, VariableSizeGrid as Grid } from 'react-window';
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
export interface BaseTableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onScroll'>{
    /** 宽度 */
    width: number;
    /** 高度 */
    height: number
    /** 子节点信息 */
    children: ReactNode
    /** 数据源信息 */
    dataSource: Array<DataRow>
    /** 内部使用属性 header 头部的高度信息 */
    headerHeight?: number
    /** 内部使用属性 是否隐藏滚动条 */
    innerStyle?: CSSProperties
    /** 容器的 ref 引用对象 */
    containerRef?: MutableRefObject<HTMLDivElement>
    /** 内部的表格元素 */
    innerRef?: MutableRefObject<HTMLDivElement>
    /** 表格滚动的时候触发的事件 */
    onScroll?: (props: GridOnScrollProps) => void;
    /** 行的样式信息 */
    rowStyle?: (rowIndex: number, cell: DataCell) => CSSProperties
}

/** 表格组件 */
const BaseTable = forwardRef<Grid, BaseTableProps>(({
    children,
    width = 1000,
    height = 400,
    dataSource = [],
    headerHeight,
    innerStyle,
    containerRef = createRef<HTMLDivElement>(),
    innerRef = createRef<HTMLDivElement>(),
    rowStyle,
    onScroll,
    ...restProps
}, ref) => {
    const headerRef = useRef<HTMLDivElement>();
    const cols: DataColumn[] = useColDataBottom(children)

    const bodyCols = cols

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
            ref={containerRef}
        >
            <HeaderContainer
                className='summer-table-header'
                style={{
                    width,
                    height: headerHeight,
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
                    ref={ref}
                    width={width}
                    height={height}
                    columnCount={bodyCols.length}
                    innerRef={innerRef}
                    columnWidth={(index) => bodyCols[index].width}
                    rowHeight={rowHeight}
                    estimatedColumnWidth={estimatedColumnWidth / bodyCols.length}
                    rowCount={dataSource.length}
                    style={innerStyle}
                    itemData={{
                        rowStyle,
                        dataSource,
                        bodyCols,
                        currentHoverIndex,
                        cols,
                        innerRef
                    }}
                    onScroll={(param) => {
                        headerRef.current?.scrollTo({
                            top: param.scrollTop,
                            left: param.scrollLeft
                        })
                        hoverRender(innerRef.current, currentHoverIndex.current);
                        onScroll?.(param)
                    }}
                >
                    {CellRender}
                </GridStyled>
            </div>
        </div>
    ); 
});

const getFixedWidth = (fixedCols: Array<JSX.Element> ) => {
    let width = 0;
    fixedCols.forEach(element => {
        width += element.props.width || 120
    })
    return width;
}


export interface TableProps extends Omit<BaseTableProps, 'headerHeight' | 'innerStyle' | 'innerRef'> {
}

type FixedColumnParam = {
    ref: MutableRefObject<Grid>
    height: number
    fixedCols: Array<JSX.Element>
    headerHeight: number
    dataSource: Array<DataRow>
    direction: 'left' | 'right'
}

const useFixedColumn = ({
    ref,
    fixedCols,
    headerHeight,
    dataSource,
    height,
    direction
}: FixedColumnParam) => {
    const [tableHeight, setTableHeight] = useState<number>(0) 
    const containerRef = useRef<HTMLDivElement>()
    useLayoutEffect(() => {
        if (fixedCols.length > 0) {
            setTableHeight(containerRef.current.getBoundingClientRect().height);
        }
    }, [headerHeight])


    const style: CSSProperties = {
        position: 'absolute',
        float: direction,
        top: 0,
        backgroundColor: '#fff',
    }
    if (direction === 'right') {
        style.right = 2
    }

    if (fixedCols.length > 0) {
        return (
            <BaseTable
                ref={ref}
                containerRef={containerRef}
                width={getFixedWidth(fixedCols)}
                height={height}
                dataSource={dataSource}
                headerHeight={headerHeight}
                innerStyle={{
                    overflow: 'hidden'
                }}
                style={style}
            >
                {fixedCols}
            </BaseTable>
        )
    }

    return null;
}

export default function Table ({
    width,
    height = 400,
    children,
    dataSource,
    onScroll,
    rowStyle,
}: TableProps) {

    const fixedLeftCols: Array<JSX.Element> = []
    const fixedRightCols: Array<JSX.Element> = []

    if (Array.isArray(children)) {
        children.forEach(element => {
            if (isValidElement(element) && element?.props?.fixed === 'left') {  
                fixedLeftCols.push(element);
            } else if (isValidElement(element) && element?.props?.fixed === 'right') {
                fixedRightCols.push(element)
            }
        })
    }

    const [headerHeight, setHeaderHeight] = useState<number>(0)

    const tableRef = useRef<HTMLDivElement>()
    const leftRef = useRef<Grid>()
    const rightRef = useRef<Grid>()

    useEffect(() => {
        if (fixedRightCols.length > 0 || fixedLeftCols.length > 0) {
            setHeaderHeight(tableRef.current.querySelector('.summer-table-header').getBoundingClientRect().height); 
        }
    }, [])

    const tableElement = (
        <>
            <BaseTable
                width={width}
                height={height}
                dataSource={dataSource}
                onScroll={(param) => {
                    if (leftRef.current) {
                        leftRef.current.scrollTo({
                            scrollLeft: 0,
                            scrollTop: param.scrollTop
                        })
                    }
                    if (rightRef.current) {
                        rightRef.current.scrollTo({
                            scrollLeft: 0,
                            scrollTop: param.scrollTop
                        })
                    }
                    onScroll?.(param);
                }}
                rowStyle={rowStyle}
                containerRef={tableRef} 
            >
                {children}
            </BaseTable>
            {useFixedColumn({
                ref: leftRef,
                height: height  - getScrollbarWidth(),
                fixedCols: fixedLeftCols,
                headerHeight,
                dataSource,
                direction: 'left'
            })}
            {useFixedColumn({
                ref: rightRef,
                height: height  - getScrollbarWidth(),
                fixedCols: fixedRightCols,
                headerHeight,
                dataSource,
                direction: 'right'
            })}
        </>
    )

    if (fixedLeftCols.length > 0 || fixedRightCols.length > 0) {
        return (
            <div
                style={{
                    height: headerHeight + height,
                    position: 'relative'
                }}
            >
                {tableElement}
            </div>
        )
    }
    return tableElement
}

export { Column } from './column';