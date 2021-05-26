import styled, { css } from 'styled-components';

import { DefaultTheme, disable } from '@summer/theme';

const btn = css`
    background-image: none;
    background: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    box-shadow: 0 2px 0 rgba(0 0 0 / 2%);
    color: rgba(0,0,0,.85);
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    font-weight: 400;
    height: 32px;
    line-height: 1.5715;
    padding: 4px 15px;
    position: relative;
    text-align: center;
    touch-action: manipulation;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    :hover {
        filter: contrast(95%);
    }
    :active {
        ::before {
            display: inline;
            transform: scale(5);
            background-image: radial-gradient(
                rgba(255, 255, 255, 0.2) 0px, 
                rgba(255, 255, 255, 0.3) 40%, 
                rgba(255, 255, 255, 0.4) 50%, 
                rgba(255, 255, 255, 0.5) 60%, 
                    rgba(255, 255, 255, 0) 70%
            );
        }
    }
    :disabled {
        ${disable}
    }
    ::before{
        z-index: 1;
        display: none;
        position: absolute;
        content: ' ';
        left: 0px;
        width: 100%;
        height: 100%;
    }
`

export const StyledButtonPrimary = styled.button`
    ${btn}
    background: ${props => props.theme.colorPrimary};
    color: #fff;
    border-color: ${props => props.theme.colorPrimary};
`;

StyledButtonPrimary.defaultProps = {
    theme: DefaultTheme
}

export const StyledButtonDefault = styled.button`
    ${btn}
`

StyledButtonDefault.defaultProps = {
    theme: DefaultTheme
}


export const IconStyled = styled.span`
    vertical-align: middle;
`
