import styled from 'styled-components';
import { DefaultTheme, disable } from '@summer/theme';

export const CheckboxStyled = styled.input`
    appearance: none;
    position: relative;
    height: 16px;
    width: 16px;
    outline: none;
    cursor: ${props => props.disabled ? 'default': 'pointer' };
    margin-right: 10px;
    border: 1px solid #d3d3d3;
    background-color: ${props => {
        return props.checked ? props.theme.colorPrimary: 'unset';
    }};
    box-shadow: ${props => props.checked ? '2px 2px 8px rgba(0, 0, 0, 0.05)' : 'unset'};
    ::after {
        content: ' ';
        display: ${props => props.checked ? 'unset': 'none'};
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
    :focus {
        border: ${props => `1px solid ${props.theme.colorPrimary}`};
    }
    :disabled {
        ${disable}
    }
`

CheckboxStyled.defaultProps = {
    theme: DefaultTheme
}

export const ContentStyled = styled.span`
    display: inline-flex;
    position: relative;
    align-items: center;
    cursor: default;

`