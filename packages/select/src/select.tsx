import React, { Attributes, cloneElement, HTMLAttributes, isValidElement, useEffect, useRef, useState } from 'react'
import { AiOutlineDown, AiOutlineCloseCircle } from 'react-icons/ai';

import { FixedSizeList as List } from 'react-window'
import { Input, InputProps } from '@summer/input';
import { DropDown } from '@summer/dropdown';


interface SelectOptionProps extends HTMLAttributes<HTMLDivElement> {
    value: string | number
}

export const SelectOption = ({
    ...restProps
} : SelectOptionProps) => {
    return (
        <div {...restProps} />
    )
}

interface SelectProps extends Omit<InputProps, 'children'>  {
    children?: JSX.Element[]
}

const Select = ({
    children
}: SelectProps) => {
    const [visible, setVisible] = useState<boolean>(false)
    
    let itemCount = 0;

    if (isValidElement(children)) {
        itemCount = 1;
    } else if (Array.isArray(children)) {
        itemCount = children.length
    }

    const [top, setTop] = useState<number>(0)
    const [width, setWidth] = useState<number>(0);

    const input = useRef<HTMLDivElement>();

    useEffect(() => {
        if (input.current) {
            const { height, width } = input.current.getBoundingClientRect();
            setTop(height + 2)
            setWidth(width);
        }
    }, [])

    return (
        <div
            style={{
                position: 'relative',
            }}
        >
            <DropDown
                style={{
                    left: 0,
                    top
                }}
                overlay={(
                    <List
                        width={width}
                        height={200}
                        itemCount={itemCount}
                        itemSize={30}
                    >
                        {({ index, style }) => {
                            const element = children![index];
                            return cloneElement(element, {
                                ...element.props,
                                style: {
                                    ...style,
                                    ...(element.props.style || {})
                                }
                            })
                        }}
                    </List>
                )}
                visible={visible}
            >
                <Input
                    containerRef={input}
                    onFocus={() => {
                        setVisible(true)
                    }}
                    onBlur={() => {
                        setVisible(false)
                    }}
                />
            </DropDown>
        </div>
    )
}


export default Select;