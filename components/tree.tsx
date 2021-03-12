import React, { cloneElement, HTMLAttributes, isValidElement, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { FixedSizeList  as List } from 'react-window';


const TreeNodeTitleStyled = styled.div`
`

const TreeNodeStyled = styled.div.attrs(props => {
})`
    height: 25px;
    padding-left: ${props => `${props.level * 1.5}em`};
`

interface TreeNodeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>  {
    title: ReactNode;
    level: number;
}

export const TreeNode = ({
    children,
    title,
    ...restProps
}: TreeNodeProps) => {
    return (
        <TreeNodeStyled
            {...restProps}
        >
            <TreeNodeTitleStyled>
                {title}
            </TreeNodeTitleStyled>
        </TreeNodeStyled>
    )
}

export type TreeNodeDataType = {
    title: string
    level?: number
    children: TreeNodeDataType[]
}

interface TreeProps extends HTMLAttributes<HTMLDivElement> {
    treeData: TreeNodeDataType[]
}

export default function Tree({
    treeData,
}: TreeProps) {

    const treeDataFlat: TreeNodeDataType[] = useMemo(() => {
        const recursion = (data: TreeNodeDataType[], level: number) => {
            const result = [];
            data.forEach(element => {
                result.push({
                    ...element,
                    level,
                });
                if (element.children) {
                    result.push(...recursion(element.children, level + 1))
                }
            })
            return result;
        }
        return recursion(treeData, 0);
    }, [treeData])

    return (
        <List
            height={400}
            itemCount={treeDataFlat.length}
            itemSize={25}
            width="100%"
        >
            {({ index, style }) => {
                const data = treeDataFlat[index];
                return <TreeNode style={style} title={data.title} level={data.level}/>
            }}
        </List>
    )
}