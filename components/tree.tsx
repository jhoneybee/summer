import React, {
    createContext,
    Dispatch,
    forwardRef,
    HTMLAttributes,
    MutableRefObject,
    ReactNode,
    useMemo,
    useReducer,
    useRef
} from 'react';
import styled from 'styled-components';
import { FixedSizeList  as List, ListProps } from 'react-window';
import { AiFillCaretRight, AiFillCaretDown } from 'react-icons/ai';
import produce from 'immer';

import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'

import DropDown from './dropdown';
import { Loading } from './animation'
import { primaryColor } from './styles/global'


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
    display: inline-flex;
    cursor: pointer;
    height: 25px;
    align-items: center;
    width: ${props => `calc(100% - ${(props.level * 2) + .2}em)`};
    margin-left: ${props => `${(props.level * 2) + .2}em`};
    border-bottom: ${props => props.dropState === 'bottom' ? `1px solid ${primaryColor(props)}` : 'unset'};
    border-top: ${props => props.dropState === 'top' ? `1px solid ${primaryColor(props)}` : 'unset'};
    :hover {
        background-color: #f5f5f5;
    };
`

type DropState = 'none' | 'top' | 'bottom';

interface TreeNodeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onDrop'>  {
    title: ReactNode;
    level: number;
    isLeaf: boolean;
    expanded?: boolean;
    data?: DataNode;
    loadState?: LoadStateType;
    draggable?: boolean;
    isFirst?: boolean;
    isLast?: boolean;
    titleRender?: (node: JSX.Element, data: DataNode) => JSX.Element;
    iconRender?: (node: JSX.Element, data: DataNode) => JSX.Element;
    onExpand?: () => void;
    /** 拖拽放下的时候触发的事件 */
    onDrop?: (sourceNode: DataNode, targetNode: DataNode, dropState: DropState) => void;
}

export const TreeNode = ({
    title,
    isLeaf = true,
    data,
    loadState,
    expanded,
    draggable = false,
    isFirst = false,
    isLast = false,
    titleRender,
    iconRender,
    onDrop,
    onExpand,
    ...restProps
}: TreeNodeProps) => {

    const ref = useRef<HTMLElement>();

    let icon = <AiFillCaretRight />
    if (expanded) {
        icon = <AiFillCaretDown />
    }

    if (loadState === 'await') {
        icon = <Loading />
    }

    let dom = <span>{title}</span>;

    if (titleRender) {
        dom = titleRender(dom, data);
    }

    if (iconRender) {
        icon = iconRender(icon, data);  
    }

    const getDropState = (): DropState => {
        const rect = ref.current?.getBoundingClientRect();
        const dragY = sourceClientOffset?.y;
        const currentY = rect?.y;
        const itemData = item?.data;
        if (
            currentY &&
            dragY &&
            itemData && 
            itemData.key !== data.key &&
            (
                isOver ||
                (isFirst && dragY <= currentY) ||
                (isLast && dragY >= currentY)
            )
        ) {
            if (dragY >= currentY){
                return 'bottom';
            } 
            
            if (dragY <=  currentY) {
                return 'top';
            }
            return 'none'
        } 
        return 'none';
    }

    const [{ item, sourceClientOffset, isOver }, drop] = useDrop({
        accept: TreeDnDType,
        collect: (monitor) => ({
            handlerId: monitor.getHandlerId(),
            isOver: monitor.isOver(),
            sourceClientOffset: monitor.getSourceClientOffset(),
            item: monitor.getItem()
        }),
        drop: (dropItem: any) => {
            onDrop?.(data, dropItem.data as DataNode, getDropState())
        }
    })

    const [{ isDragging }, drag] = useDrag({
        type: TreeDnDType,
        item: () => ({
            data,
        }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: () => draggable,
    });

    drag(drop(ref));

    return (
        <TreeNodeStyled
            ref={ref}
            isDragging
            dropState={getDropState()}
            {...restProps}
        >
         
            {isLeaf ? undefined : (
                 <IconStyled
                    onClick={onExpand}
                 >
                    {icon}
                </IconStyled> 
            )}
            {dom}
        </TreeNodeStyled>
    )
}

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
    /** 是否展开节点信息 */
    expanded?: boolean
}

type ExpandParam = {
    expandedKeys: Array<string | number>
    expanded: boolean,
    nodeData: DataNode,
}

interface TreeProps extends ListProps {
    /** 节点信息 */
    treeData: DataNode[]
    /** 右键遮挡信息 */
    overlay?: ReactNode
    expandedKeys?: string[]
    /** 是否允许节点拖拽 */
    draggable?: boolean
    /** 渲染node信息的render */
    nodeRender?: (node: JSX.Element, data: DataNode) => JSX.Element;
    /** 渲染title的render */
    titleRender?: (node: JSX.Element, data: DataNode) => JSX.Element;
    /** 渲染icon的render */
    iconRender?: (node: JSX.Element, data: DataNode) => JSX.Element;
    /** 异步渲染,装载数据 */
    loadData?: (nodeData: DataNode) => Promise<Array<DataNode>>
    /** 节点展开触发事件 */
    onExpand?: (expandedKeys: ExpandParam) => void
    /** 拖拽放下的时候触发的事件 */
    onDrop?: (sourceNode: DataNode, targetNode: DataNode, dropState: DropState) => void;
    /** 改变 treeData 触发的事件 */
    onChange?: (treeData: DataNode[]) => void
}


/**
 * 查看到具体的节点信息
 * @param dataNodes 当期要查找的节点集合
 * @param callback 查找节点的判断条件, 返回 true 表示是, false 表示不是这个数据
 */
export const findTreeNode = (dataNodes: DataNode[], callback: (node: DataNode) => boolean) => {
    dataNodes.some((data) => {
        if (callback(data)) {
            return true;
        }
        if (data.children instanceof Array && data.children.length > 0) {
            findTreeNode(data.children, callback);
        } else {
            return false;
        }
    })
}

const TreeDnDType = 'TreeDnDType';

export default function Tree({
    treeData = [],
    overlay,
    draggable,
    expandedKeys,
    nodeRender,
    titleRender,
    iconRender,
    loadData,
    onExpand,
    onChange,
    onDrop,
    ...restProps
}: TreeProps) {

    const [state, dispatch] = useReducer(treeReducer, {
        expandedKeys: [],
        visible: false,
    });

    const getExpandedKeys = () => {
        return expandedKeys !== undefined ? expandedKeys: state.expandedKeys;
    }

    const setExpandedKeys = (param: ExpandParam) => {
        if (!expandedKeys) {
            dispatch({
                type: 'setExpandedKeys',
                payload: param.expandedKeys,
            }) 
        } 
        onExpand?.(param);
    }

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

                if (getExpandedKeys().includes(element.key)) {
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
    }, [treeData, expandedKeys, state.expandedKeys])

    const itemDom = (
        <List
            {...restProps}
            height={400}
            itemCount={treeDataFlat.length}
            itemSize={25}
        >
            {({ index, style }) => {
                const data = treeDataFlat[index];
                const treNodeDom = (
                    <TreeNode
                        style={{
                            ...style,
                            width: undefined
                        }}
                        key={data.key}
                        title={data.title}
                        level={data.level}
                        isLeaf={data.isLeaf}
                        loadState={data.loadState}
                        draggable={draggable}
                        isFirst={index === 0}
                        isLast={index == treeDataFlat.length - 1}
                        titleRender={titleRender}
                        iconRender={iconRender}
                        data={data}
                        expanded={getExpandedKeys().includes(data.key)}
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
                        onExpand={() => {
                            const expand = (newData: Array<string | number>, expanded: boolean) => {
                                setExpandedKeys({
                                    expandedKeys: newData,
                                    expanded,
                                    nodeData: data,
                                })

                                if (data.children === 'lazy' && expanded) {
                                    // 懒加载数据信息
                                    loadData?.(data).then((lazyData) => {
                                        onChange?.(produce(treeData, changeTreeData => {
                                            findTreeNode(changeTreeData, changeData => {
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
                        
                            const index = getExpandedKeys().indexOf(data.key)
                            if (index > -1) {
                                const newData = produce(getExpandedKeys(), changeData => {
                                    changeData.splice(index, 1)
                                });
                                expand(newData, false);
                            } else {
                                const newData = produce(getExpandedKeys(), changeData => {
                                    changeData.push(data.key)
                                });
                                expand(newData, true);
                            }
                        }}
                        onDrop={onDrop}
                    />
                )
                if (nodeRender) {
                    return nodeRender(treNodeDom, data);
                }
                return treNodeDom;
            }}
        </List>
    );

    const dom = overlay ? (
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
            {itemDom}
        </DropDown>
    ): itemDom

    return (
        <Context.Provider
            value={{
                state,
                dispatch
            }}
        >
            <DndProvider
                backend={HTML5Backend}
                context={window}
            >
                {dom}
            </DndProvider>
        </Context.Provider>
    )
}
