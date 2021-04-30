import React, { 
    cloneElement,
    InputHTMLAttributes,
    isValidElement,
    ReactNode,
    useContext,
    useEffect,
    useReducer,
    createContext,
    useState,
    Dispatch
 } from 'react'
import { AiOutlineDown, AiOutlineCloseCircle } from 'react-icons/ai';

import Input from './input';
import DropDown, { DropDownMenu ,DropDownMenuItem, DropDownMenuItemProps }  from './dropdown';


interface SelectOptionClickType {
    value: string | number;
    label: string;
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
}


type Action =
| { type: 'setVisible', payload: boolean }
| { type: 'setSelect', payload: SelectOptionClickType }
| { type: 'setScrollOffset', payload: number }
| { type: 'setVisibleAndSelect', payload: { select: SelectOptionClickType, visible: boolean } };


interface State {
    select?: SelectOptionClickType,
    scrollOffset?: number,
    visible?: boolean
}

const Context = createContext<{
    state: State;
    dispatch: Dispatch<Action>;
  }>({
    state: {},
    dispatch: () => null
  });


function selectReducer(state: State, action: Action): State {
    const type = action.payload;
    switch (action.type) {
        case 'setVisible':
            return {
                ...state,
                visible: action.payload
            };
        case 'setSelect':
            return {
                ...state,
                select: action.payload
            };
        case 'setScrollOffset':
            return {
                ...state,
                scrollOffset: action.payload
            };
        case 'setVisibleAndSelect':
            return {
                ...state,
                ...action.payload,
            };
        default:
            throw Error(`reducer unknown type [${type}]`);
    }
}

interface SelectOptionProps extends Omit<DropDownMenuItemProps, 'onClick'> {
    value?: string;
    label?: string;
    onClick?: (selectOptionClickType: SelectOptionClickType) => void;
}

export const SelectOption = ({
    value,
    children,
    onClick,
    label,
    ...restProps
}: SelectOptionProps) => {
    const { dispatch } = useContext(Context);
    return (
        <DropDownMenuItem
            data-value={value}
            onMouseDown={(event) => {
                if (event.button === 0) {
                    const value = event.currentTarget.getAttribute('data-value');  
                    onClick?.({
                        value,
                        label: label || event.currentTarget.textContent,
                        event
                    })
                    dispatch({
                        type: 'setVisibleAndSelect',
                        payload: {
                            select: {
                                value,
                                label: label || event.currentTarget.textContent,
                                event
                            },
                            visible: false
                        },
                    });
                }
                event.preventDefault();
            }}
            {...restProps}
        >
            {children}
        </DropDownMenuItem>
    )
}

interface SelectProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value: string | number;
    allowClear: boolean;
    onChange:  (selectOptionClickType: SelectOptionClickType) => void;
}

const Select = ({
    value,
    onBlur,
    onFocus,
    onClick,
    children,
    onChange,
    readOnly = true,
    allowClear = true,
    style = {},
    className,
    ...restProps
}: SelectProps) => {

    const [state, dispatch] = useReducer(selectReducer, {
        select: {
            value: value || '',
            label: '',
            event: null,
        },
        scrollOffset: 0,
        visible: false
    });
    
    const findItemByValue = (
        value: string | number | undefined
    ): { value: string | number, label: string } | undefined => {

        if (children instanceof Array) {
            const reactElement: ReactNode = children.find((element: React.ReactElement) => {
                return element.key === value;
            });

            if (isValidElement(reactElement)) {
                const label: string = (reactElement.props.label || reactElement.props.children.toString()) as string
                const value: string | number = reactElement.props.value;
                return {
                    label,
                    value,
                }
            }
        } else if (isValidElement(children)) {
            const label: string = (children.props.label || children.props.children.toString()) as string
            const value: string | number = children.key;
            return {
                label,
                value,
            }
        }
        return undefined;
    }
    
    useEffect(() => {
        onChange?.(state.select);
    }, [state.select])

    const [dropItems, setDropItems] = useState<ReactNode>([]);
   
    const formateChildren = (): ReactNode => {
        if (children instanceof Array) {
            return children.map((element: ReactNode) => {
                if (isValidElement(element)) {
                    if (element.props.children) {
                        return element;
                    }
                    return cloneElement(element, {
                        ...element.props,
                        key: element.key,
                        value: element.props.value ? element.props.value : element.key,
    
                        children: element.props.children ? element.props.children : element.props.label
                    })
                } 
                return element;
            })
        } else if (isValidElement(children)) {
            return cloneElement(children, {
                ...children.props,
                key: children.key,
                value: children.props.value ? children.props.value : children.key,
                children: children.props.children ? children.props.children : children.props.label
            })
        }
        return [];
    }

    useEffect(() => {
        setDropItems(formateChildren())
    }, [children])


    const [hover, setHover] = useState<boolean>(false);

    const isCloseCircle = hover && allowClear && state.select.value !== '';
    const Icon = isCloseCircle ? AiOutlineCloseCircle : AiOutlineDown;
    return (
        <Context.Provider
            value={{
                state,
                dispatch
            }}
        >
            <DropDown
                visible={state.visible}
                trigger='none'
                overlay={(
                    <DropDownMenu
                        scrollTop={state.scrollOffset}
                        onScroll={({ scrollOffset}) => {
                            dispatch({
                                type: 'setScrollOffset',
                                payload: scrollOffset
                            })
                        }}
                    >
                        {dropItems}
                    </DropDownMenu>
                )}
                onMouseDown={(event) => {
                    event.preventDefault();
                }}
            >
                <Input
                    {...restProps}
                    data-value={findItemByValue(value)?.value || state.select.value}
                    value={findItemByValue(value)?.label || state.select.label}
                    readOnly={readOnly}
                    suffix={
                        <Icon
                            onMouseEnter={() => {
                                setHover(true);
                            }}
                            onMouseLeave={() => {
                                setHover(false);
                            }}
                            onMouseDown={(event) => {
                                if (event.button === 0 && isCloseCircle) {
                                    dispatch({
                                        type: 'setSelect',
                                        payload: {
                                            value: '',
                                            label: '',
                                            event: null,
                                        }
                                    })
                                }
                            }}
                        />
                    }
                    onChange={(event) => {
                        const changeSelect = {
                            value: event.target.value,
                            label: event.target.value,
                            event: undefined,
                        }
                        dispatch({
                            type: 'setSelect',
                            payload: changeSelect
                        })
                        onChange?.(changeSelect);
                    }}
                    onClick={(event) => {
                        dispatch({
                            type: 'setVisible',
                            payload: true
                        })
                        onClick?.(event);
                    }}
                    onFocus={(event) => {
                        dispatch({
                            type: 'setVisible',
                            payload: true
                        })
                        onFocus?.(event);
                    }}
                    onBlur={(event) => {
                        dispatch({
                            type: 'setVisible',
                            payload: false
                        })
                        onBlur?.(event);
                    }}
                    onMouseEnter={() => {
                        setHover(true);
                    }}
                    onMouseLeave={() => {
                        setHover(false)
                    }}
                />
            </DropDown>
        </Context.Provider>
    )
}

export default Select;