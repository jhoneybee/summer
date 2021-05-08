import React, { cloneElement, forwardRef, HTMLAttributes, useEffect, useRef, useState } from "react";
import { GridChildComponentProps } from "react-window";
import styled from 'styled-components';
import produce from 'immer';
import { writeText } from '@summer/clipboard';
import { DefaultTheme } from '@summer/theme';

import { DataCell, DataColumn, DataRow } from "./type";
import { hoverRender } from './_utils';


/** 单元格样式 */
const CellStyled = styled.div.attrs(props => {
})`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 0 8px;
    box-sizing: border-box;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    line-height: 35px;
    user-select: none;
    :focus {
        border: ${props => `1px solid ${props.theme.colorPrimary}`};
    }
`

CellStyled.defaultProps = {
    theme: DefaultTheme
}

export interface CellProps extends HTMLAttributes<HTMLDivElement> {
    cell?: DataCell
}

/** 当期表格的单元格信息 */
export const Cell = forwardRef<HTMLDivElement, CellProps>(({
    cell,
    ...restProps
}: CellProps, ref) => {
    return (
        <CellStyled
            ref={ref}
            {...restProps}
        />
    );
})

/** 渲染单元格的事件 */
export const CellRender = ({ style, rowIndex, columnIndex, data, isScrolling }: GridChildComponentProps) => {

    const { 
        dataSource,
        currentHoverIndex,
        rowStyle,
        cols,
        rootRef,
        onChange
    } = data;
    const row = dataSource[rowIndex];
    const cell: DataCell = row.cells.find((ele: DataCell) => ele.name === cols[columnIndex].name) || {};
    const col: DataColumn = cols[columnIndex];

    /** 是否编辑状态 */
    const [isEditor, setIsEditor] = useState<boolean>(false)

    const [value, setValue] = useState(cell.value)

    const rStyle = rowStyle?.(rowIndex, cell) || {}

    /** 编辑器的 dom */
    const editorRef = useRef<HTMLInputElement>()
    const cellRef = useRef<HTMLDivElement>();

    useEffect(() => {
        if (isEditor) {
            editorRef.current?.focus();
        }
    }, [isEditor])

    useEffect(() => {
        const newDataSource = produce(dataSource, (changeDataSource: Array<DataRow>) => {
            const currentCell = changeDataSource[rowIndex].cells.find(ele => ele.name === cols[columnIndex].name)
            if (currentCell) {
                currentCell.value = value
            }
        })
        onChange?.(newDataSource)
    }, [value])


    // 快捷键
    const keyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'c' && e.ctrlKey) {
            writeText(cellRef.current?.innerText!);
            setTimeout(() => {
                cellRef.current?.focus();
            }, 20)
        }
    }

    if (col.render) {
        const renderDom = col.render(cell, row, rowIndex)
        const { style: renderStyle, onKeyDown, ...restProps } = renderDom.props
        return cloneElement(renderDom, {
            className: `summer-row-${rowIndex} summer-cell`,
            style: {
                ...(renderStyle || {}),
                ...style
            },
            onKeyDown: (e :React.KeyboardEvent<HTMLElement>) => {
                onKeyDown?.(e);
                keyDown(e);
            },
            ...restProps,
        })
    }

    if (isEditor) {
        const editor = col.editor?.({
            value: value || '',
            col,
            cell,
            onChange: setValue,
        }, () => {
            setIsEditor(false)
        });
        const { style: editorStyle, ...restProps } = editor!.props
        return cloneElement(editor!, {
            ...restProps,
            ref: editorRef,
            style: {
                ...(editorStyle || {}),
                ...style,
            },
            onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
                if (e.key === 'Enter') {
                    setIsEditor(false)
                }
                restProps.onKeyDown?.(e)
            }
        })
    }

    return (
        <Cell
            ref={cellRef as React.Ref<HTMLDivElement>}
            style={{
                ...rStyle,
                ...style,
            }}
            className={`summer-row-${rowIndex} summer-cell`}
            onDoubleClick={() => {
                if (col.editor) {
                    setValue(cell.value)
                    setIsEditor(true)
                }
            }}
            tabIndex={-1}
            onKeyDown={keyDown}
            onMouseEnter={(e) => {
                currentHoverIndex.current = rowIndex;
                hoverRender(rootRef.current,rowIndex);
            }}
            key={`row-${rowIndex}col-${columnIndex}`}
            cell={cell}
        >
            {cell.value}
        </Cell>
    )
}