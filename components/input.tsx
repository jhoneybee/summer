import React, { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

import { primaryColor, fontColor, disabledColor, disabledBackgroundColor } from './styles/global'

const SuffixStyles = styled.i.attrs(props => {
})`
    z-index: 1;
    position: absolute;
    right: 14px;
    top:  20%;
    width: 12px;
    height: 12px;
    color: ${props => props.disabled ? disabledColor(props) : 'rgba(0,0,0,.25)'};
    :hover {
        cursor: pointer;
        color: rgba(0,0,0,.85);
    }
    pointer-events: ${props => props.disabled ? 'none': 'unset'};
`

const PrefixStyles = styled.i.attrs(props => {
})`
    z-index: 1;
    position: absolute;
    margin-left: 5px;
    margin-top: 3px;
    color: ${props => props.disabled ? disabledColor(props) : 'rgba(0,0,0,.25)'};
    :hover {
        cursor: pointer;
        color: ${props => props.disabled ? disabledColor(props) : 'rgba(0,0,0,.85)'};
    }
    pointer-events: ${props => props.disabled ? 'none': 'unset'};
`;

const ContainerStyles = styled.div.attrs(props => {
})`
    display: inline-flex;
    position: relative;
    margin-left: 1em;
    align-items: center;
    border: 1px solid #d9d9d9;
    :focus {
        border: ${props => props.disabled ? '1px solid #d9d9d9' : `1px solid ${primaryColor(props)}`}
    }
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
    cursor: ${props => {
        if (props.disabled) {
            return 'default';
        }

        if (props.readOnly) {
            return props.readOnly ? 'pointer': 'auto'
        }
        return 'unset';
    }};
    transition: border 600ms;
    color: ${props => props.disabled ? disabledColor(props) : fontColor(props)};
    color: ${props => props.disabled ? disabledBackgroundColor(props): 'unset' };
    padding-left: ${props => props.isHavePrefix ? '25px': '12px'};
    width: ${props => {
        return `${props.defaultWidth + 25}px`;
    }};
    ::placeholder {
        opacity: .5;
    }
`

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
    prefix?: ReactNode
    suffix?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    prefix,
    suffix,
    style,
    disabled,
    ...restProps
}, ref) => {

    let defaultWidth = style?.width || 140;
    return (
        <ContainerStyles
            ref={ref}
            disabled={disabled}
        >
            <PrefixStyles
                disabled={disabled}
            >
                {prefix}
            </PrefixStyles>
            <InputStyled
                defaultWidth={defaultWidth}
                disabled={disabled}
                isHavePrefix={prefix ? true : false}
                {...restProps}
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