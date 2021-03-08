import React, { forwardRef, InputHTMLAttributes } from 'react';
import styled from 'styled-components';

import { primaryColor, fontColor, disabledColor } from './styles/global'

export const IconStyles = styled.span.attrs(props => {
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

const InputStyled = styled.input.attrs(props => { 
})`
    outline: none;
    font-size: 14px;
    line-height: 1.5715;
    border: 1px solid #d9d9d9;
    padding: 4px 11px;
    cursor: ${props => props.readOnly ? 'pointer': 'auto'};
    transition: border 600ms;
    color: ${props => props.disabled ? disabledColor(props) : fontColor(props)};
    ::placeholder {
        opacity: .5;
    }
    :focus {
        border: ${props => props.disabled ? '1px solid #d9d9d9' : `1px solid ${primaryColor(props)}`}
    }
    :hover {
        border: ${props => props.disabled ? '1px solid #d9d9d9' : `1px solid ${primaryColor(props)}`}
    }
`

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    return <InputStyled {...props} ref={ref} />
})

export default Input;