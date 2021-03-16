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
import { FixedSizeList  as List, ListProps } from 'react-window';
import { AiFillCaretRight, AiFillCaretDown } from 'react-icons/ai';
import produce from 'immer';

import DropDown from './dropdown';
import { Loading } from './animation'


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

type LoadStateType = 'await' | 'finish';

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
            throw Error(`reducer console.logunknown type [${type}]`);
    }
}

const IconStyled = styled.div`
    display: inline-block;
    margin-right: 8px;
    width: 16px;
`

const TreeNodeStyled = styled.div.attrs(props => {
})`
    display: inline-flex;
    cursor: pointer;
    height: 25px;
    align-items: center;
    padding-left: ${props => `${(props.level * 1) + .2}em`};
    :hover {
        background-color: #f5f5f5;
    }
`

interface TreeNodeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>  {
    title: ReactNode;
    level: number;
    isLeaf: boolean;
    expanded?: boolean;
    loadState?: LoadStateType;
}

export const TreeNode = forwardRef(({
    title,
    isLeaf = true,
    loadState,
    expanded,
    ...restProps
}: TreeNodeProps, ref) => {
    let icon = <AiFillCaretRight />
    if (expanded) {
        icon = <AiFillCaretDown />
    }

    if (loadState === 'await') {
        icon = <Loading />
    }
    return (
        <TreeNodeStyled
            ref={ref}
            {...restProps}
        >
            <IconStyled>
                {isLeaf ? undefined : icon}
            </IconStyled>
            {title}
        </TreeNodeStyled>
    )
})

export type DataNode = {
    /** 显示的节点的标题信息 */
    title: string
    /** 当期tree节点唯一的 key 信息 */
    key: number | string
    /** 加载状态 */
    loadState: LoadStateType
    /** 如果是字符串 lazy 则表示是通过loadData来懒加载 tree 的子节点信息 */
    children?: DataNode[] | 'lazy'
    /** 内部使用的属性 */
    level?: number
    /** 判断是否是子节点信息 */
    isLeaf?: boolean
}

type ExpandParam = {
    expandedKeys: Array<string | number>
    expanded: boolean,
    nodeData: DataNode,
}

interface TreeProps extends ListProps {
    treeData: DataNode[]
    overlay?: ReactNode
    nodeRender?: ComponentType<TreeNodeProps>;
    loadData?: (nodeData: DataNode) => Promise<Array<DataNode>>
    onExpand?: (expandedKeys: ExpandParam) => void
    onChange?: (treeData: DataNode[]) => void
}

const recursion = (dataNodes: DataNode[], callback: (node: DataNode) => boolean) => {
    dataNodes.some((data) => {
        if (callback(data)) {
            return true;
        }
        if (data.children instanceof Array && data.children.length > 0) {
            recursion(data.children, callback);
        } else {
            return false;
        }
    })
}

export default function Tree({
    treeData = [],
    overlay,
    nodeRender: NodeRender = TreeNode,
    loadData,
    onChange,
    onExpand,
    ...restProps
}: TreeProps) {
    const [state, dispatch] = useReducer(treeReducer, {
        expandedKeys: [],
        visible: false,
    });

    const treeDataFlat: DataNode[] = useMemo(() => {
        const recursion = (data: DataNode[], level: number) => {
            const result = [];
            data.forEach(element => {
                
                let isLeaf = true;
                if (element.isLeaf === true || (element.children && element.children.length > 0 )) {
                    isLeaf = false;
                }

                const node = {
                    ...element,
                    level,
                    isLeaf,
                }
                result.push(node);

                if (state.expandedKeys.includes(element.key)) {
                    if (element.children instanceof Array) {
                        result.push(...recursion(element.children, level + 1))
                        // 设置状态加载完成
                        node.loadState = 'finish';
                    } else if (element.children === 'lazy') {
                        node.loadState = 'await';
                    }
                }
            })
            return result;
        }
        return recursion(treeData, 0);
    }, [treeData, state.expandedKeys])

    const dom = (
        <List
            {...restProps}
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
                        isLeaf={data.isLeaf}
                        loadState={data.loadState}
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

                                if (data.children === 'lazy') {
                                    // 懒加载数据信息
                                    loadData?.(data).then((lazyData) => {
                                        onChange?.(produce(treeData, changeTreeData => {
                                            recursion(changeTreeData, changeData => {
                                                if (changeData.key === data.key) {
                                                    changeData.children = lazyData;
                                                    return true;
                                                }
                                                return false;
                                            });
                                        }));
                                    })
                                }
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
    );

    return (
        <Context.Provider
            value={{
                state,
                dispatch
            }}
        >
            {overlay ? (
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
                    {dom}
                </DropDown>
            ): dom}
        </Context.Provider>
    )
}