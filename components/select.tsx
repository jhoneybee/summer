import React, { cloneElement, InputHTMLAttributes, isValidElement, ReactNode, useContext, useEffect, useState } from 'react'
import { observer, useLocalObservable } from 'mobx-react-lite'

import Input from './input';
import DropDown, { DropDownMenu ,DropDownMenuItem, DropDownMenuItemProps }  from './dropdown';


const SelectStoreContext = React.createContext(null);

interface SelectOptionClickType {
    value: string | number;
    children: ReactNode;
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
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
    const store = useContext(SelectStoreContext);
    return (
        <DropDownMenuItem
            data-value={value}
            onMouseDown={(event) => {
                if (event.button === 0) {
                    const value =  event.currentTarget.getAttribute('data-value');  
                    onClick?.({
                        value,
                        children,
                        event
                    })
                    store.setVisible(false);
                    store.setSelect({
                        value,
                        children: event.currentTarget.textContent,
                        event
                    })
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
    onChange:  (selectOptionClickType: SelectOptionClickType) => void;
}

const Select = observer<SelectProps>(({
    value,
    onBlur,
    onFocus,
    onClick,
    children,
    onChange,
    readOnly = true,
    ...restProps
}) => {
    const store = useLocalObservable(() => ({
        select: {
            value: value || '',
            children: '',
            event: null,
        },
        scrollOffset: null,
        visible: false,

        setVisible(newVisible){
            this.visible = newVisible;
        },
        setSelect(newSelect){
            this.select = newSelect;
        },
        setScrollOffset(newScrollOffset: number) {
            this.scrollOffset = newScrollOffset;
        }
    }))

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
        onChange?.(store.select);
    }, [store.select])

    const [dropItems, setDropItems] = useState<ReactNode>([]);
   
    const formateChildren = (): ReactNode => {
        if (children instanceof Array) {
            return children.map((element: React.ReactElement) => {
                if (element.props.children) {
                    return element;
                }
                return cloneElement(element, {
                    ...element.props,
                    key: element.key,
                    value: element.props.value ? element.props.value : element.key,

                    children: element.props.children ? element.props.children : element.props.label
                })
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

    return (
        <SelectStoreContext.Provider value={store}>
            <DropDown
                visible={store.visible}
                overlay={(
                    <DropDownMenu
                        scrollTop={store.scrollOffset}
                        onScroll={({ scrollOffset}) => {
                            store.setScrollOffset(scrollOffset);
                        }}
                    >
                        {dropItems}
                    </DropDownMenu>
                )}
            >
                <Input
                    {...restProps}
                    data-value={findItemByValue(value)?.value || store.select.value}
                    value={findItemByValue(value)?.label || store.select.children}
                    readOnly={readOnly}
                    onChange={(event) => {
                        store.setSelect({
                            value: event.target.value,
                            children: event.target.value,
                            event: undefined,
                        });
                        onChange?.(store.select);
                    }}
                    onClick={(event) => {
                        store.setVisible(true);
                        onClick?.(event);
                    }}
                    onFocus={(event) => {
                        store.setVisible(true);
                        onFocus?.(event);
                    }}
                    onBlur={(event) => {
                        store.setVisible(false);
                        onBlur?.(event);
                    }}
                />
            </DropDown>
        </SelectStoreContext.Provider>
    )
})

export default Select;