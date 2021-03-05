import React, { forwardRef, InputHTMLAttributes } from 'react';
import styled from 'styled-components';

const InputStyled = styled.input.attrs(props => { 
})`
    outline: none;
    font-size: 14px;
    line-height: 1.5715;
    border: 1px solid #d9d9d9;
    padding: 4px 11px;
    cursor: ${props => props.readOnly ? 'pointer': 'auto'};
    transition: border 600ms;
    color: ${props => props.disabled ? 'rgba(0, 0, 0, 0.26)' : 'rgba(0,0,0,.85)'};
    ::placeholder {
        opacity: .5;
    }
    :focus {
        border: ${props => props.disabled ? '1px solid #d9d9d9' : '1px solid #6002ee'}
    }
    :hover {
        border: ${props => props.disabled ? '1px solid #d9d9d9' : '1px solid #6002ee'}
    }
`

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    return <InputStyled {...props} ref={ref} />
})

export default Input;