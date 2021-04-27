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
    MutableRefObject,
    createRef,
    cloneElement,
    useLayoutEffect,
} from 'react';
import { GridOnScrollProps, VariableSizeGrid as Grid } from 'react-window';
import styled from 'styled-components';
import { produce } from 'immer'

import { DataCell, DataRow, DataColumn } from './type';
import { CellRender } from './cell';
import { getScrollbarWidth, hoverRender } from './_utils';

const HeaderContainer = styled.div.attrs(props => {
})`
    display: flex;
    background: #fafafa;
    border-top: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-left: 1px solid #ddd;
`

const GridStyled = styled(Grid).attrs(props => {
})`
    border: 1px solid #ddd;
`

/** 获取真实的列信息, 排除分组头部 */
const useColDataBottom = (children: ReactNode) => {
    const cols: DataColumn[] = useMemo(() => {
        const getColumnHeaderBottom = (element: JSX.Element[]): DataColumn[] => {
            const dataCols: DataColumn[] = [];
            element.forEach(child => {
                if (child) {
                    if (child?.props?.children) {
                        if (Array.isArray(child.props.children)) {
                            dataCols.push(...getColumnHeaderBottom(child.props.children))
                        } else {
                            dataCols.push(...getColumnHeaderBottom([child.props.children]))
                        }
                    } else {
                        dataCols.push({
                            name: child.props.name,
                            width: child.props.width || 120,
                            render: child.props.render,
                            fixed: child.props.fixed,
                            editor: child.props.editor
                        })
                    }
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
    onResize: (width: number, name: string) => void
}

const useHeaderColMap = (children: ReactNode, props: any) => {
    const cols: ReactNode[] = useMemo(() => {
        const recursionCols = (element: JSX.Element[]): ReactNode[] => {
            const dataCols: ReactNode[] = [];
            element.forEach(child => {
                if (child) {
                    if (child?.props?.children) {
                        if (Array.isArray(child.props.children)) {
                            const childNode = [...recursionCols(child.props.children)]
                            dataCols.push(cloneElement(child, {
                                key: child.key,
                                ...child.props,
                                children: childNode,
                                ...props,
                            }))
                        } else {
                            const childNode = [...recursionCols([child.props.children])]
                            dataCols.push(cloneElement(child, {
                                key: child.key,
                                ...child.props,
                                children: childNode,
                                ...props,
                            }))
                        }
                    } else {
                        dataCols.push(cloneElement(child, {
                            key: child.key,
                            ...child.props,
                            ...props
                        }))
                    }
                }
            })
            return dataCols;
        }
        if (Array.isArray(children) ) {
            return recursionCols(children as JSX.Element[])
        }
        return recursionCols([children] as JSX.Element[]);
    }, [children])
    return cols;
}

/** 表格的头部信息 */
const TableHeader = forwardRef<HTMLDivElement, TableHeaderProps>(({
    children,
    onResize,
    ...restProps
}: TableHeaderProps, ref) => {
    return (
        <TableHeaderStyled
            ref={ref}
            {...restProps}
        >
            {useHeaderColMap(children, {
                onResize,
            })}
        </TableHeaderStyled>
    )
})

/** 表格的配置信息 */
export interface BaseTableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onScroll' | 'onChange'>{
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
    /** 内部使用的 ref 对象 */
    rootRef?: MutableRefObject<HTMLDivElement>
    /** 行的样式信息 */
    rowStyle?: (rowIndex: number, cell: DataCell) => CSSProperties
    /** 表格滚动的时候触发的事件 */
    onScroll?: (props: GridOnScrollProps) => void
    /** 用户变改数据的时候触发的事件 */
    onChange?: (dataSource: Array<DataRow>) => void
}

/** 表格组件 */
const BaseTable = forwardRef<Grid, BaseTableProps>(({
    children,
    width,
    height,
    dataSource = [],
    headerHeight,
    innerStyle,
    containerRef = createRef<HTMLDivElement>(),
    innerRef = createRef<HTMLDivElement>(),
    rootRef,
    rowStyle,
    onScroll,
    onChange,
    ...restProps
}, ref) => {

    const cols = useColDataBottom(children)
    
    const gridRef = useRef<Grid>();
    const headerRef = useRef<HTMLDivElement>();

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

    const hoverRef = rootRef?.current === undefined ? containerRef : rootRef;

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
                    onResize={(width, name) => {
                        const index = cols.findIndex(element => element.name === name)
                        const resizeCol = cols[index];
                        if (resizeCol) {
                            resizeCol.width = width
                        }
                        gridRef.current.resetAfterColumnIndex(index)
                    }}
                    style={{
                        width: tableHeaderWidth - 2,
                    }}
                >
                    {children}
                </TableHeader>
            </HeaderContainer>
            <GridStyled
                ref={(grid) => {
                    if (ref && typeof(ref) === 'function') {
                        ref(grid)
                    } else if (ref && typeof(ref) === 'object') {
                        ref.current = grid
                    }
                    gridRef.current = grid;
                }}
                width={width}
                height={height}
                columnCount={cols.length}
                innerRef={innerRef}
                columnWidth={(index: number) => cols[index].width}
                rowHeight={rowHeight}
                estimatedColumnWidth={estimatedColumnWidth / cols.length}
                rowCount={dataSource.length}
                style={{
                    willChange: 'unset',
                    ...(innerStyle || {})
                }}
                itemData={{
                    rowStyle,
                    dataSource,
                    cols,
                    currentHoverIndex,
                    rootRef: hoverRef,
                    onChange,
                }}
                onScroll={(param) => {
                    headerRef.current?.scrollTo({
                        top: param.scrollTop,
                        left: param.scrollLeft
                    })
                    onScroll?.(param)
                    hoverRender(hoverRef.current, currentHoverIndex.current);
                }}
            >
                {CellRender}
            </GridStyled>
        </div>
    ); 
});

export interface TableProps extends Omit<
    BaseTableProps,
    'headerHeight' |
    'innerStyle' |
    'innerRef' |
    'onCellClick'
> {
}

type FixedColumnParam = {
    ref: MutableRefObject<Grid>
    height: number
    left: number
    fixedCols: Array<JSX.Element>
    headerHeight: number
    dataSource: Array<DataRow>
    direction: 'left' | 'right'
    rootRef: MutableRefObject<HTMLDivElement>
    onChange?: (dataSource: Array<DataRow>) => void
}

const useFixedColumn = ({
    ref,
    left,
    fixedCols,
    headerHeight,
    dataSource,
    height,
    direction,
    rootRef,
}: FixedColumnParam) => {

    const containerRef = useRef<HTMLDivElement>()
    const colBottom = useColDataBottom(fixedCols)

    const style: CSSProperties = {
        position: 'absolute',
        float: direction,
        top: 0,
        backgroundColor: '#fff',
    }


    let width: number = 0;

    colBottom.forEach(element => {
        width += element.width || 120
    })

    if (direction === 'right') {
        // -2 表示滚动条的偏移
        style.left = left - width - 3;
        style.boxShadow = '-2px 0 5px -2px rgb(136 136 136 / 30%)'
    } else if (direction === 'left') {
        style.left = 0;
        style.boxShadow = '2px 0 5px -2px rgb(136 136 136 / 30%)'
    }
   
    
    if (fixedCols.length > 0) {
        return (
            <BaseTable
                ref={ref}
                containerRef={containerRef}
                width={width + 3}
                height={height}
                dataSource={dataSource}
                headerHeight={headerHeight}
                rootRef={rootRef}
                innerStyle={{
                    overflow: 'hidden',
                }}
                style={style}
            >
                {fixedCols.map((element, index) => {
                    if (index === 0) {
                        return cloneElement(element, {
                            ...element.props,
                            width: (element.props.width || 120) + 3
                        })
                    }
                    return element
                })}
            </BaseTable>
        )
    }
    return null;
}

export default function Table ({
    width = 1000,
    height = 400,
    children,
    dataSource,
    onScroll,
    rowStyle,
    onChange
}: TableProps) {
     
    const [headerHeight, setHeaderHeight] = useState<number>(0)

    /** 根元素的 dom 组件 */
    const rootDivRef = useRef<HTMLDivElement>()
    /** table 的容器组件 */
    const tableRef = useRef<HTMLDivElement>()
    /** 表格 body 的节点信息 */
    const innerRef = useRef<HTMLDivElement>();

    const {
        fixedLeftCols,
        fixedRightCols,
        normalCols
    } = useMemo(() => {
        const fixedLeftCols: Array<JSX.Element> = []
        const fixedRightCols: Array<JSX.Element> = []
        const normalCols: Array<JSX.Element> = []
    
        // 如果列被分组, 那么就存在固定列失效的问题
        if (Array.isArray(children)) {
            children.forEach(element => {
                if (isValidElement(element) && element?.props?.fixed === 'left') {  
                    fixedLeftCols.push(element);
                } else if (isValidElement(element) && element?.props?.fixed === 'right') {
                    fixedRightCols.push(element)
                } else if (isValidElement(element)) {
                    normalCols.push(element)
                }
            })
        }
        return {
            fixedLeftCols,
            fixedRightCols,
            normalCols
        }
    }, [children])

    const leftRef = useRef<Grid>()
    const rightRef = useRef<Grid>()

    useEffect(() => {
        if (fixedRightCols.length > 0 || fixedLeftCols.length > 0) {
            setHeaderHeight(tableRef.current.querySelector('.summer-table-header').getBoundingClientRect().height); 
        }
    }, [])

    const tableElement = (
        <BaseTable
            width={width}
            height={height}
            rootRef={rootDivRef}
            dataSource={dataSource}
            innerRef={innerRef}
            onChange={onChange}
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
            {[...fixedLeftCols, ...normalCols, ...fixedRightCols]}
        </BaseTable>
    )

    if (fixedLeftCols.length > 0 || fixedRightCols.length > 0) {
        return (
            <div
                ref={rootDivRef}
                style={{
                    height: headerHeight + height,
                    position: 'relative'
                }}
            >
                {tableElement}
                {useFixedColumn({
                    ref: leftRef,
                    height: height - getScrollbarWidth(),
                    fixedCols: fixedLeftCols,
                    headerHeight,
                    dataSource,
                    rootRef: rootDivRef,
                    direction: 'left',
                    left: 0,
                    onChange
                })}
                {useFixedColumn({
                    ref: rightRef,
                    height: height - getScrollbarWidth(),
                    fixedCols: fixedRightCols,
                    headerHeight,
                    dataSource,
                    left: width - getScrollbarWidth(),
                    rootRef: rootDivRef,
                    direction: 'right',
                    onChange
                })}
            </div>
        )
    }
    return (
        <div
            ref={rootDivRef}
            style={{
                position: 'relative'
            }}
        >
            {tableElement}
        </div>
    )
}

export { Column } from './column';