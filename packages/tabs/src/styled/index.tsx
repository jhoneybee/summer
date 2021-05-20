import styled from 'styled-components';

import { DefaultTheme } from '@summer/theme';

export const TabsHeaderItemStyled = styled.li.attrs(props => {
})`
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: .3em 1em;
    position: relative;
    background-color: #fff;
    bottom: -1px;
    border-top: ${props => props.isActive ? '1px solid #d3d3d3' : 'unset'};
    border-left: ${props => props.isActive ? '1px solid #d3d3d3' : 'unset'};
    border-right: ${props => props.isActive ? '1px solid #d3d3d3' : 'unset'};
    border-bottom: ${props => props.isActive ?  'unset' : '1px solid #d3d3d3'};
    border-radius: ${props => props.isActive ? '1px solid #d3d3d3' : 'unset'};
    :hover {
        color: ${props => props.theme.colorPrimary}
    }
`

TabsHeaderItemStyled.defaultProps = {
    theme: DefaultTheme
}

export const TabsHeaderWrapStyled = styled.ul`
    display: flex;
    height: 40px;
    padding-inline-start: .5em;
    border-bottom: 1px solid #d3d3d3;
`