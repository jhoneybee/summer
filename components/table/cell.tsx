import React, { cloneElement, HTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";
import { GridChildComponentProps } from "react-window";
import styled from 'styled-components';

import { DataCell, DataColumn } from "./type";
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
`

export interface CellProps extends HTMLAttributes<HTMLDivElement> {
    cell?: DataCell
}

/** 当期表格的单元格信息 */
export const Cell = ({
    cell,
    ...restProps
}: CellProps) => {
    return (
        <CellStyled
            {...restProps}
        />
    );
}

/** 渲染单元格的事件 */
export const CellRender = ({ style, rowIndex, columnIndex, data }: GridChildComponentProps) => {
    const { 
        dataSource,
        currentHoverIndex,
        rowStyle,
        cols,
        rootRef,
    } = data;
    const row = dataSource[rowIndex];
    const cell: DataCell = row.cells.find(ele => ele.name === cols[columnIndex].key);
    const col: DataColumn = cols[columnIndex];

    /** 是否编辑状态 */
    const [isEditor, setIsEditor] = useState<boolean>(false)

    const [value, setValue] = useState(cell.value)

    const rStyle = rowStyle?.(rowIndex, cell) || {}

    /** 编辑器的 dom */
    const editorRef = useRef<HTMLInputElement>()

    useEffect(() => {
        if (isEditor) {
            editorRef.current.focus();
        }
    }, [isEditor])

    useEffect(() => {
        console.log(value)
    }, [value])

    if (col.render) {
        const renderDom = col.render(cell, row, rowIndex)
        const { style: renderStyle, ...restProps } = renderDom.props
        return cloneElement(renderDom, {
            className: `summer-row-${rowIndex} summer-cell`,
            style: {
                ...(renderStyle || {}),
                ...style
            },
            ...restProps
        })
    }

    if (isEditor) {
        const editor = col.editor({
            value,
            col,
            cell,
            onChange: setValue,
        }, () => {
            setIsEditor(false)
        });
        const { style: editorStyle, ...restProps } = editor.props
        return cloneElement(editor, {
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
            style={{
                ...rStyle,
                ...style
            }}
            className={`summer-row-${rowIndex} summer-cell`}
            onDoubleClick={() => {
                if (col.editor) {
                    setValue(cell.value)
                    setIsEditor(true)
                }
            }}
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