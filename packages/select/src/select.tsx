import React, { cloneElement, HTMLAttributes, isValidElement, useEffect, useMemo, useRef, useState } from 'react'
import { AiOutlineDown, AiOutlineCloseCircle } from 'react-icons/ai';

import { FixedSizeList as List } from 'react-window'
import { Input, InputProps } from '@summer/input';
import { DropDown } from '@summer/dropdown';

import { SelectOptionStyled } from './styled';

interface SelectOptionProps extends HTMLAttributes<HTMLDivElement> {
    title: string
}


export const SelectOption = ({
    title,
    children,
    ...restProps
} : SelectOptionProps) => {
    return (
        <SelectOptionStyled {...restProps} >{children? children : title}</SelectOptionStyled>
    )
}

type SelectData = {
    key: string | null
    title: string
}

interface SelectProps extends Omit<InputProps, 'children' | 'onChange'>  {
    children?: JSX.Element[]
    onChange?: (data: SelectData) => void
}



const Select = ({
    disabled,
    children,
    value,
    onChange,
    ...restProps
}: SelectProps) => {
    const [visible, setVisible] = useState<boolean>(false)
    
    let itemCount = 0;

    if (isValidElement(children)) {
        itemCount = 1;
    } else if (Array.isArray(children)) {
        itemCount = children.length
    }

    const propsValue = useMemo(() => {
        const result: SelectData = {
            key: '',
            title: ''
        }
        if (Array.isArray(children)) {
            children.some((element) => {
                if (element.key === value) {
                    result.key = element.key + ''
                    result.title = element.props.title
                    return true
                }
                return false
            })
        }
        return result;
    }, [children, value])

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
                        style={{
                            marginTop: 5
                        }}
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
                                },
                                onMouseDown: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
                                    e.preventDefault();
                                    const key = element.key + ''
                                    onChange?.({
                                        key,
                                        title: element.props.title
                                    })
                                    setVisible(false)
                                }
                            })
                        }}
                    </List>
                )}
                visible={visible}
            >
                <Input
                    value={propsValue.title}
                    disabled={disabled}
                    containerRef={input}
                    onFocus={() => {
                        setVisible(true)
                    }}
                    onClick={() => {
                        setVisible(true)
                    }}
                    onBlur={() => {
                        setVisible(false)
                    }}
                    suffix={<AiOutlineDown />}
                    onChange={(event) => {
                        onChange?.({
                            key: null,
                            title: event.target.value
                        })
                    }}
                    {...restProps}
                />
            </DropDown>
        </div>
    )
}

export default Select;