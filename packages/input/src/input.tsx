import React, { forwardRef, InputHTMLAttributes, MutableRefObject, ReactNode, useState } from 'react';

import { SuffixStyles, PrefixStyles, ContainerStyles, InputStyled} from './styled'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
    prefix?: ReactNode
    suffix?: ReactNode
    containerRef?: MutableRefObject<HTMLDivElement>
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    prefix,
    suffix,
    style,
    disabled,
    containerRef,
    onFocus,
    onBlur,
    ...restProps
}, ref) => {

    const [focus, setFocus] = useState<boolean>(false);

    const defaultWidth = style?.width || 140;

    return (
        <ContainerStyles
            containerRef={containerRef}
            disabled={disabled}
            style={style}
            focus={focus}
        >
            <PrefixStyles
                disabled={disabled}
            >
                {prefix}
            </PrefixStyles>
            <InputStyled
                ref={ref}
                defaultWidth={defaultWidth}
                disabled={disabled}
                isHavePrefix={prefix ? true : false}
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
            <SuffixStyles
                disabled={disabled}
            >
                {suffix}
            </SuffixStyles>
        </ContainerStyles>
    )
})
