import React, { InputHTMLAttributes, useState } from 'react';
import styled from 'styled-components';

import { primaryColor, disabled, borderDefaultStyle, borderRadiusStyle } from './styles/global'

export interface CheckboxProps extends  Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
    checked: boolean
}

const CheckboxStyled = styled.input`
    appearance: none;
    position: relative;
    height: 16px;
    width: 16px;
    border-radius: ${borderRadiusStyle};
    outline: none;
    border: ${borderDefaultStyle};
    cursor: ${props => props.disabled ? 'default': 'pointer' };
    margin-right: 10px;
    ::after {
        content: ' ';
        position: absolute;
        border: 2px solid #fff;
        border-left: 0;
        border-top: 0;
        height: 8px;
        width: 4px;
        left: 4.2px;
        top: 1px;
        transform: rotate(45deg);
    }
    background-color: ${props => {
        return props.checked ? primaryColor(props): 'unset';
    }};
    box-shadow: ${props => props.checked ? '2px 2px 8px rgba(0, 0, 0, 0.05)' : 'unset'};
    ${props => props.disabled ? disabled : null}
`

const ContentStyled = styled.span`
    display: inline-flex;
    position: relative;
    align-items: center;
    padding-right: 1em;
    cursor: default;
`

/**
 * 多选框
 */
export default function Checkbox ({
    style,
    className,
    children,
    checked,
    onChange,
    ...restProps
}: CheckboxProps) {
    const [value, setValue] = useState<boolean>(false);
    return (
        <ContentStyled
            className={className}
            style={style}
        >
            <CheckboxStyled
                {...restProps}
                type='checkbox'
                checked={checked !== undefined ? checked : value}
                onChange={(event) => {
                    setValue(event.target.checked);
                    onChange?.(event);
                }}
            />
            {children}
        </ContentStyled>
    );
}