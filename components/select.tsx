import React, { forwardRef, HTMLAttributes, useState, ReactNode } from 'react'
import Input from './input';
import DropDown, { DropDownMenu ,DropDownMenuItem, DropDownMenuItemProps }  from './dropdown';

interface SelectProps extends HTMLAttributes<HTMLInputElement> {
}

interface SelectOptionClickType {
    value: string | number;
    children: ReactNode;
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
}

interface SelectOptionProps extends Omit<DropDownMenuItemProps, 'onClick'> {
    value: string | number;
    onClick: (selectOptionClickType: SelectOptionClickType) => void;
}

export const SelectOption = ({
    value,
    children,
    onClick,
    ...restProps
}: SelectOptionProps) => {
    return (
        <DropDownMenuItem
            data-value={value}
            onClick={(event) => {
                const value =  event.currentTarget.getAttribute('data-value');  
                onClick?.({
                    value,
                    children,
                    event
                })
                event.preventDefault();
            }}
            onMouseDown={(event) => {
                event.preventDefault();
            }}
            {...restProps}
        >
            {children}
        </DropDownMenuItem>
    )
}

const Select = forwardRef<HTMLInputElement, SelectProps>(({
    onBlur,
    onFocus,
    children,
    ...restProps
}, ref) => {
    const [visible, setVisible] = useState<boolean>(false);
    return (
        <DropDown
            visible={visible}
            overlay={(
                <DropDownMenu>
                    {children}
                </DropDownMenu>
            )}
        >
            <Input
                {...restProps}
                ref={ref}
                onFocus={(event) => {
                    setVisible(true)
                    onFocus?.(event);
                }}
                onBlur={(event) => {
                    setVisible(false)
                    onBlur?.(event);
                }}
                
            />
        </DropDown>
    )
});

export default Select;