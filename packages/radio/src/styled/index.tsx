import styled from 'styled-components';

import { DefaultTheme } from '@summer/theme';

export const RadioStyled = styled.input.attrs(props => {
})`
    appearance: none;
    outline: none;
    align-items: center;
    cursor: pointer;
    position: relative;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    margin-right: .5em;
    border: 1px solid #d9d9d9;
    box-sizing: content-box;

    ::before {
        display: inline-block;
        content: ' ';
        width: 8px;
        height: 8px;
        position: absolute;
        top: 4px;
        left: 4px;
        border-radius: 50%;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, .3);
        background-color: ${props => props.theme.colorPrimary};
        visibility: ${props => props.select ? 'visible' : 'hidden'};
    }
`;

RadioStyled.defaultProps = {
    theme: DefaultTheme
}

export const ContentStyled = styled.div`
    display: inline-flex;
    align-items: center;
`
