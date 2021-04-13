import { ReactNode } from "react";

export type Align = 'left' | 'right' | 'center';

/**
 * 单元格的数据结构
 */
export type DataCell = {
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
    /** 表格内容的行高 */
    rowHeight?: number
}

/**
 * 行的数据结构
 */
export type DataRow = {
    /** 单元格 */
    cells: DataCell[]
}

export type EditorType = {
    col: DataColumn,
    cell: DataCell,
    onChange: (value: string | number) => void
    value: string | number | boolean
}

/**
 * 列的数据结构
 */
export type DataColumn = {
    /** 唯一的 key */
    key: string | number
    /** 列的宽度 */
    width?: number
    /** 列的readner 事件 */
    render?:  (cell: DataCell, row: DataRow, rowIndex: number) => JSX.Element
    /** 固定列的方向 */
    fixed?: 'left' | 'right'
    /** 子列信息 */
    children?: DataColumn[]
    /** 编辑器 */
    editor?: (info: EditorType, end: () => void) => JSX.Element
}