import React, { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

import { primaryColor, fontColor, disabledColor } from './styles/global'

const SuffixStyles = styled.i.attrs(props => {
})`
    z-index: 1;
    position: absolute;
    right: 14px;
    top:  20%;
    width: 12px;
    height: 12px;
    color: rgba(0,0,0,.25);
    :hover {
        cursor: pointer;
        color: rgba(0,0,0,.85);
    }
`

const PrefixStyles = styled.i.attrs(props => {
})`
    z-index: 1;
    position: absolute;
    color: rgba(0,0,0,.25);
    margin-left: 5px;
    margin-top: 3px;
    :hover {
        cursor: pointer;
        color: rgba(0,0,0,.85);
    }
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
    cursor: ${props => props.readOnly ? 'pointer': 'auto'};
    transition: border 600ms;
    color: ${props => props.disabled ? disabledColor(props) : fontColor(props)};
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
    ...restProps
}, ref) => {

    let defaultWidth = style?.width || 214;
    return (
        <ContainerStyles ref={ref}>
            <PrefixStyles>
                {prefix}
            </PrefixStyles>
            <InputStyled
                defaultWidth={defaultWidth}
                isHavePrefix={prefix ? true : false}
                {...restProps}
            />
            <SuffixStyles>
                {suffix}
            </SuffixStyles>
        </ContainerStyles>
    )
})

export default Input;