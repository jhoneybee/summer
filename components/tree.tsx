import React, {
    ComponentType,
    createContext,
    Dispatch,
    forwardRef,
    HTMLAttributes,
    ReactNode,
    useMemo,
    useReducer
} from 'react';
import styled from 'styled-components';
import { FixedSizeList  as List } from 'react-window';
import { AiFillCaretRight, AiFillCaretDown } from 'react-icons/ai';

import DropDown from './dropdown';


type Action =
| { type: 'setExpandedKeys', payload: Array<string | number> }
| { type: 'setVisible', payload: boolean }
| { type: 'setVisibleAndOffset', payload: {
    visible: boolean,
    offsetTop: number,
    offsetLeft: number,
}}

interface State {
    expandedKeys: Array<number | string>
    visible: boolean
    offsetTop?: number
    offsetLeft?: number
}

const Context = createContext<{
    state: State;
    dispatch: Dispatch<Action>;
  }>({
    state: {
        expandedKeys: [],
        visible: false
    },
    dispatch: () => null
  });


function treeReducer(state: State, action: Action): State {
    const type = action.payload;
    switch (action.type) {
        case 'setExpandedKeys':
            return {
                ...state,
                expandedKeys: action.payload
            };
        case 'setVisible':
            return {
                ...state,
                visible: action.payload
            };
        case 'setVisibleAndOffset': 
            return {
                ...state,
                ...action.payload
            };
        default:
            throw Error(`reducer unknown type [${type}]`);
    }
}

const IconStyled = styled.div`
    display: inline-block;
    margin-right: 8px;
    width: 16px;
`

const TreeNodeStyled = styled.div.attrs(props => {
})`
    display: inline-block;
    cursor: pointer;
    height: 25px;
    padding-left: ${props => `${props.level * 1}em`};
    :hover {
        background-color: #f5f5f5;
    }
`

interface TreeNodeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>  {
    title: ReactNode;
    level: number;
    isHaveChildren: boolean;
    expanded?: boolean
}

export const TreeNode = forwardRef(({
    title,
    isHaveChildren,
    expanded,
    ...restProps
}: TreeNodeProps, ref) => {
    let icon = <AiFillCaretRight />
    if (expanded) {
        icon = <AiFillCaretDown />
    }
    return (
        <TreeNodeStyled
            ref={ref}
            {...restProps}
        >
            <IconStyled>
                {isHaveChildren ?  icon : undefined}
            </IconStyled>
            {title}
        </TreeNodeStyled>
    )
})

export type DataNode = {
    title: string
    key: number | string
    children?: DataNode[] | boolean
    /** 内部使用的属性 */
    level?: number
    isHaveChildren?: boolean
}

type ExpandParam = {
    expandedKeys: Array<string | number>
    expanded: boolean,
    nodeData: DataNode,
}

interface TreeProps extends HTMLAttributes<HTMLDivElement> {
    treeData: DataNode[]
    overlay?: ReactNode
    nodeRender?: ComponentType<TreeNodeProps>;
    loadData?: (nodeData: DataNode) => Promise<Array<DataNode>>
    onExpand?: (expandedKeys: ExpandParam) => void
}

export default function Tree({
    treeData = [],
    overlay,
    nodeRender: NodeRender = TreeNode,
    loadData,
    onExpand,
}: TreeProps) {
    const [state, dispatch] = useReducer(treeReducer, {
        expandedKeys: [],
        visible: false,
    });

    const treeDataFlat: DataNode[] = useMemo(() => {
        const recursion = (data: DataNode[], level: number) => {
            const result = [];
            data.forEach(element => {
                
                let isHaveChildren = false;
                if (element.children === true || (element.children && element.children.length > 0 )) {
                    isHaveChildren = true;
                }

                const node = {
                    ...element,
                    level,
                    isHaveChildren,
                }

                result.push(node);
                if (state.expandedKeys.includes(element.key)) {
                    if (element.children) {
                        // 异步加载子节点
                        if (element.children === true) {
                            loadData(node).then((childrens: DataNode[]) => {
                                result.push(...recursion(childrens, level + 1))
                            })
                        } else {
                            result.push(...recursion(element.children, level + 1))
                        }
                    }
                }
            })
            return result;
        }
        return recursion(treeData, 0);
    }, [treeData, state.expandedKeys])

    return (
        <Context.Provider
            value={{
                state,
                dispatch
            }}
        >
            <DropDown
                visible={state.visible}
                trigger='noneFocus'
                width={120}
                offsetTop={state.offsetTop}
                offsetLeft={state.offsetLeft}
                overlay={overlay}
                scrollHideOverlay
                onBlur={() => {
                    dispatch({
                        type: 'setVisible',
                        payload: false
                    })
                }}
                onChangeVisible={(changeVisible: boolean) => {
                    dispatch({
                        type: 'setVisible',
                        payload: changeVisible
                    })
                }}
            >
                <List
                    height={400}
                    itemCount={treeDataFlat.length}
                    itemSize={25}
                    width="100%"
                >
                    {({ index, style }) => {
                        const data = treeDataFlat[index];
                        return (
                            <NodeRender
                                style={style}
                                title={data.title}
                                level={data.level}
                                isHaveChildren={data.isHaveChildren}
                                expanded={state.expandedKeys.includes(data.key)}
                                onContextMenu={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                                    dispatch({
                                        type: 'setVisibleAndOffset',
                                        payload: {
                                            visible: true,
                                            offsetTop: event.clientY,
                                            offsetLeft: event.clientX,
                                        }
                                    })
                                    event.preventDefault();
                                }}
                                onClick={() => {
                                    const expand = (newData: Array<string | number>) => {
                                        dispatch({
                                            type: 'setExpandedKeys',
                                            payload: newData,
                                        })
                                        onExpand?.({
                                            expandedKeys: newData,
                                            expanded: state.expandedKeys.includes(data.key),
                                            nodeData: data,
                                        })
                                    }
                                
                                    if (state.expandedKeys.includes(data.key)) {
                                        const newData = [];
                                        state.expandedKeys.forEach(element => {
                                            if (element !== data.key) {
                                                newData.push(element)
                                            }
                                        })
                                        expand(newData);
                                    } else {
                                        const newData = [...state.expandedKeys];
                                        newData.push(data.key);
                                        dispatch({
                                            type: 'setExpandedKeys',
                                            payload: newData,
                                        })
                                        expand(newData);
                                    }
                                }}
                            />
                        )
                    }}
                </List>
            </DropDown>
        </Context.Provider>
    )
}