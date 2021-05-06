import React, { forwardRef, InputHTMLAttributes, MutableRefObject, ReactNode, useState } from 'react';
import styled, { css } from 'styled-components';

import { primaryColor, disabled } from './styles/global'

const color = css`
    color: rgba(0,0,0,.4);
`

const hoverColor = css`
    color: rgba(0,0,0,.85);
`

const SuffixStyles = styled.i.attrs(props => {
})`
    z-index: 1;
    position: absolute;
    right: 14px;
    top:  20%;
    width: 12px;
    height: 12px;
    :hover {
        cursor: pointer;
        ${hoverColor}
    }
    ${props => props.disabled ? disabled : null}
    ${color}
    background-color: unset;

`

const PrefixStyles = styled.i.attrs(props => {
})`
    z-index: 1;
    position: absolute;
    margin-left: 5px;
    margin-top: 3px;
    :hover {
        cursor: pointer;
        ${hoverColor}
    }
    ;
    ${props => props.disabled ? disabled : null}
    background-color: unset;
    ${color}
    color: rgba(0,0,0,.4);
`;

const ContainerStyles = styled.div.attrs(props => {
})`
    display: inline-flex;
    position: relative;
    align-items: center;
    border: ${props => props.focus ? `1px solid ${primaryColor(props)}` :  '1px solid #d9d9d9' };
    overflow: hidden;
    :hover {
        border: ${props => props.disabled ? '1px solid #d9d9d9' : `1px solid ${primaryColor(props)}`}
    }

`;

const InputStyled = styled.input.attrs(props => { 
})`
    outline: none;
    font-size: 14px;
    line-height: 1.5715;
    border: unset;
    padding: 4px 11px;
    transition: border 600ms;
    padding-left: ${props => props.isHavePrefix ? '25px': '12px'};
    width: ${props => {
        return `${props.defaultWidth + 25}px`;
    }};
    cursor: ${props => {
        if (props.readOnly) {
            return props.readOnly ? 'pointer': 'auto'
        }
        return 'unset';
    }};

    ::placeholder {
        opacity: .5;
    }
    ${props => props.disabled ? disabled : null}
`

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
    prefix?: ReactNode
    suffix?: ReactNode
    containerRef?: MutableRefObject<HTMLDivElement>
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
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

    let defaultWidth = style?.width || 140;

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
                onFocus={(e) => {
                    setFocus(true)
                    onFocus?.(e)
                }}
                onBlur={(e) => {
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

export default Input;