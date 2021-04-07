import React, { HTMLAttributes } from "react";
import { GridChildComponentProps } from "react-window";
import styled from 'styled-components';

import { DataCell } from "./type";
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
        >
            {cell?.value}
        </CellStyled>
    );
}

/** 渲染单元格的事件 */
export const CellRender = ({ style, rowIndex, columnIndex, data }: GridChildComponentProps) => {
    const { dataSource, currentHoverIndex, rowStyle, cols, innerRef } = data;
    const row = dataSource[rowIndex];
    const cell: DataCell = row.cells.find(ele => ele.name === cols[columnIndex].key);
    const render = cols[columnIndex].render;

    const rStyle = rowStyle?.(rowIndex, cell) || {}
    
    const cellElement = (
        <Cell
            style={{
                ...rStyle,
                ...style
            }}
            className={`summer-row-${rowIndex} summer-cell`}
            onMouseEnter={() => {
                currentHoverIndex.current = rowIndex;
                hoverRender(innerRef.current,rowIndex);
            }}
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
}