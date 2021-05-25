import React, { forwardRef, InputHTMLAttributes, MutableRefObject, ReactNode, useState } from 'react';

import { IconStyles, ContainerStyles, InputStyled} from './styled'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
    prefix?: ReactNode
    suffix?: ReactNode
    containerRef?: MutableRefObject<HTMLDivElement | undefined>
    innerRef?: MutableRefObject<HTMLInputElement | undefined>
}

export const Input = ({
    prefix,
    suffix,
    style,
    disabled,
    containerRef,
    innerRef,
    onFocus,
    onBlur,
    ...restProps
}: InputProps) => {

    const [focus, setFocus] = useState<boolean>(false);

    return (
        <ContainerStyles
            ref={containerRef}
            disabled={disabled}
            style={style}
            focus={focus}
        >
            <IconStyles>
                {prefix}
            </IconStyles>
            <InputStyled
                ref={innerRef}
                disabled={disabled}
                {...restProps}
                onFocus={(e: any) => {
                    setFocus(true)
                    onFocus?.(e)
                }}
                onBlur={(e: any) => {
                    setFocus(false)
                    onBlur?.(e)
                }}
            />
            <IconStyles>
                {suffix}
            </IconStyles>
        </ContainerStyles>
    )
}
