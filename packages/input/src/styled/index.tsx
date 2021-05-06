import styled, { css } from 'styled-components';

import { DefaultTheme, disable } from '@summer/theme';


const color = css`
    color: rgba(0,0,0,.4);
`

const hoverColor = css`
    color: rgba(0,0,0,.85);
`

export const SuffixStyles = styled.i.attrs(props => {
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
    :disabled {
        ${disable}
    }
    ${color}
    background-color: unset;
`

SuffixStyles.defaultProps = {
    theme: DefaultTheme
}

export const PrefixStyles = styled.i.attrs(props => {
})`
    z-index: 1;
    position: absolute;
    margin-left: 5px;
    margin-top: 3px;
    :hover {
        cursor: pointer;
        ${hoverColor}
    }
    :disabled {
        ${disable}
    }

    background-color: unset;
    ${color}
    color: rgba(0,0,0,.4);
`;

PrefixStyles.defaultProps = {
    theme: DefaultTheme
}

export const ContainerStyles = styled.div.attrs(props => {
})`
    display: inline-flex;
    position: relative;
    align-items: center;
    border: ${props => props.focus ? `1px solid ${props.theme.colorPrimary}` :  '1px solid #d9d9d9' };
    overflow: hidden;
    :hover {
        border: ${props => props.disabled ? '1px solid #d9d9d9' : `1px solid ${props.theme.colorPrimary}`}
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
    :disabled {
        ${disable}
    }
`

InputStyled.defaultProps = {
    theme: DefaultTheme
}

