import React, {
    cloneElement,
    createContext,
    Dispatch,
    HTMLAttributes,
    isValidElement,
    ReactNode,
    useEffect,
    useLayoutEffect,
    useReducer,
    useRef,
    MouseEvent,
    useContext
} from 'react';
import { FixedSizeList as List, ListOnScrollProps } from 'react-window';
import styled from 'styled-components';


type Action = { type: 'setVisible', payload: boolean }

interface State {
    visible: boolean
}

export const Context = createContext<{
    state: State;
    dispatch: Dispatch<Action>;
}>({
    state: {
        visible: false,
    },
    dispatch: () => null
});

function reducer(state: State, action: Action): State {
    const type = action.payload;
    switch (action.type) {
        case 'setVisible':
            return {
                ...state,
                visible: action.payload
            };
        default:
            throw Error(`reducer unknown type [${type}]`);
    }
}

const MenuItemStyled = styled.li.attrs(props => {
})`
    cursor: ${props => props.disabled ? 'default': 'pointer'};
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    padding: 5px 12px;
    color: rgba(0,0,0,.85);
    :hover {
        background-color: #f5f5f5;
    }
`

export interface DropDownMenuItemProps extends HTMLAttributes<HTMLLIElement>{
    disabled: boolean
}

export const DropDownMenuItem = ({
    onClick,
    ...restProps
}: DropDownMenuItemProps) => {

    const { dispatch } = useContext(Context);
    return (
        <MenuItemStyled
            onClick={(event) => {
                try {
                    onClick?.(event);
                } finally {
                    console.log(event)
                    if (!event.defaultPrevented) {
                        dispatch({
                            type: 'setVisible',
                            payload: false
                        })
                    }
                }
            }}
            {...restProps}
        />
    )
}

export interface DropDownProps extends HTMLAttributes<HTMLDivElement> {
    children?: JSX.Element,
    overlay?: ReactNode,
    trigger?: 'click' | 'contextMenu' | 'hover' | 'none' | 'noneFocus',
    width?: number | 'auto';
    placement?: 'bottom' | 'top',
    visible?: boolean
    offsetTop?: number
    offsetLeft?: number
    // 滚动的时候隐藏
    scrollHideOverlay?: boolean
    onChangeVisible?: (visible: boolean) => void 
}

const MenuStyled = styled(List)`
    list-style: none;
    padding: 4px 0;
    margin: 0px;
`

interface DropDownMenuProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onScroll'> {
    scrollTop?: number;
    onScroll?: (props: ListOnScrollProps) => any;
}

export const DropDownMenu = ({
    scrollTop,
    children,
    ...restProps
}: DropDownMenuProps) => {
    let itemCount = 0;
    if (children instanceof Array) {
        itemCount = children.length;
    } else if (isValidElement(children)) {
        itemCount = 1;
    }

    const ref = useRef<List>(null)

    useEffect(() => {
        if (scrollTop) {
            ref.current.scrollTo(scrollTop);
        }
    }, [])

    let height = 150;
    if (isValidElement(children)) {
        height = 30 + 10;
    } else if (children instanceof Array && children.length * 30 < 150){
        height = children.length * 30 + 10;
    }

    return (
        <MenuStyled
            {...restProps}
            ref={ref}
            height={height}
            itemCount={itemCount}
            itemSize={30}
            width="100%"
        >
            {({ index, style }) => {
                if (children instanceof Array) {
                    let node = children[index];
                    if (isValidElement(node)) {
                        return cloneElement(node, { style })
                    }
                    return undefined;
                } else if (isValidElement(children)) {
                    return cloneElement(children, { style })
                }
            }}
        </MenuStyled> 
    )
}

const DropDownStyled = styled.div.attrs((props) => {
})`
    z-index: 10;
    min-width: 90px;
    position: fixed;
    width: ${props => props.width ? `${props.width}px` : 'unset'};
    visibility: ${props => props.visible ? 'visible': 'hidden'};
    background-color: #fff;
    padding: 0px;
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
`;

const DropDown = ({
    children,
    overlay,
    placement = 'bottom',
    trigger = 'click',
    visible = false,
    width = 'auto',
    offsetLeft,
    offsetTop,
    scrollHideOverlay,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    onChangeVisible,
    ...restPropsDropDown
}: DropDownProps) => {

    const [state, dispatch] = useReducer(reducer, {
        visible,
    });

    const ref = useRef<HTMLElement>(null);
    const dropdownRef = useRef<HTMLElement>(null);

    const { onMouseOver, onMouseOut, onClick, ...restProps } = children.props;

    const movePostion = () => {
        let topCss: string;
        let leftCss: string;
        const rect = ref.current?.getBoundingClientRect();
        const dropRect = dropdownRef.current?.getBoundingClientRect();
        if (placement === 'bottom') {
            topCss = `${rect.y + rect.height}px`;
            leftCss = `${ref.current?.getBoundingClientRect()?.x ||  0}px`;
            console.log('offsetTop', offsetTop)
            dropdownRef.current?.style?.setProperty('top', offsetTop ? `${offsetTop}px` : topCss);
            dropdownRef.current?.style?.setProperty('left', offsetLeft ? `${offsetLeft}px` : leftCss);
        } else if (placement === 'top') {
            topCss = `${rect.y - dropRect.height}px`;
            leftCss = `${rect.x}px`;
            dropdownRef.current?.style?.setProperty('top', offsetTop ? `${offsetTop}px` : topCss);
            dropdownRef.current?.style?.setProperty('left', offsetLeft ? `${offsetLeft}px` : leftCss);
        }
    }

    useEffect(() => {
        
        // 执行一次，初始化滚动位置
        movePostion();
        window.addEventListener('scroll', () => {
            if (scrollHideOverlay) {
                dispatch({
                    type: 'setVisible',
                    payload: false
                })
                return ;
            } else {
                movePostion();  
            }
        }, true);
        const observer = new IntersectionObserver(() => {
            dropdownRef.current?.blur();
        });
        
        observer.observe(ref.current);
        return () => {
            window.removeEventListener('scroll', movePostion);
            observer.disconnect();
        }
    }, [])


    useLayoutEffect(() => {
        movePostion();
    }, [offsetLeft, offsetTop]);

    const dom = cloneElement(children, {
        ...restProps,
        outerRef: ref,
        ref: (refDom: HTMLElement) => {
            if (refDom instanceof HTMLElement) {
                ref.current = refDom;
                if (restProps.ref instanceof Function) {
                    restProps.ref?.(ref.current);
                }else {
                    restProps.ref = ref;
                }
            }
        },
        onClick: (event: MouseEvent<HTMLElement, MouseEvent>) => {
            if (trigger === 'click') {
                dispatch({
                    type: 'setVisible',
                    payload: true
                })
            }
            children.props.onClick?.(event);
        },
        onMouseDown: (event: MouseEvent<HTMLElement, MouseEvent>) => {
            if (trigger === 'contextMenu' && event.button === 2 ) {
                dispatch({
                    type: 'setVisible',
                    payload: true
                })
            }
            children.props.onMouseDown?.(event);
        },
        onMouseEnter: (event: MouseEvent<HTMLElement, MouseEvent>) => {
            if (trigger === 'hover') {
                dispatch({
                    type: 'setVisible',
                    payload: true
                })
            }
            children.props.onMouseEnter?.(event);
        }
    })

    useEffect(() => {
        dispatch({
            type: 'setVisible',
            payload: visible
        });
    }, [visible])

    useLayoutEffect(() => {
        if (trigger === 'click' || trigger === 'hover' || trigger === 'noneFocus') {
            dropdownRef.current.focus();
        }
        onChangeVisible?.(state.visible)
    }, [state.visible])

    return (
        <Context.Provider
            value={{
                state,
                dispatch
            }}
        >
            <DropDownStyled
                    {...restPropsDropDown}
                    tabIndex="-1"
                    ref={dropdownRef}
                    width={width === 'auto' ? ref?.current?.getBoundingClientRect()?.width : width }
                    visible={state.visible}
                    onBlur={(event: React.FocusEvent<HTMLDivElement>) => {
                        if (trigger === 'click' || trigger === 'hover') {
                            dispatch({
                                type: 'setVisible',
                                payload: false
                            })
                        }
                        onBlur?.(event);
                    }}
                >
                    {overlay}
            </DropDownStyled>
            {dom}
        </Context.Provider>
    )   
}

export default DropDown;