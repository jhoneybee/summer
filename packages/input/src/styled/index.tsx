import styled, { css } from 'styled-components';

import { DefaultTheme, disable } from '@summer/theme';


const color = css`
    color: rgba(0,0,0,.4);
`

const hoverColor = css`
    color: rgba(0,0,0,.85);
`

export const IconStyles = styled.span.attrs(props => {
})`
    display: flex;
    align-items: center;
    :hover {
        cursor: pointer;
        ${hoverColor}
    }
    ${color};
    margin: 0px 4px;
    background-color: unset;

`

export const ContainerStyles = styled.div.attrs(props => {
})`
    display: inline-flex;
    position: relative;
    align-items: center;
    justify-items: center;
    width: 200px;
    border: ${props => props.focus ? `1px solid ${props.theme.colorPrimary}` :  '1px solid #d9d9d9' };
    overflow: hidden;
    box-sizing: border-box;
    :hover {
        border: ${props => props.disabled ? '1px solid #d9d9d9' : `1px solid ${props.theme.colorPrimary}`}
    }
    &[disabled] {
        ${disable}
    }

`;

ContainerStyles.defaultProps = {
    theme: DefaultTheme
}

export const InputStyled = styled.input.attrs(props => { 
})`
    outline: none;
    font-size: 14px;
    line-height: 1.5715;
    border: unset;
    padding: 4px 0px;
    width: 100%;
    transition: border 600ms;
    cursor: ${props => {
        if (props.readOnly) {
            return props.readOnly ? 'pointer': 'auto'
        }
        return 'unset';
    }};

    ::placeholder {
        opacity: .5;
    }
    :disabled {
        ${disable}
    }
`

InputStyled.defaultProps = {
    theme: DefaultTheme
}

