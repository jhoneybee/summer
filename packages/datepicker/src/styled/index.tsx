
import styled from 'styled-components';

export const DatePickerHeaderStyled = styled.div`
    display: flex;
    align-items: center;
    height: var(--header-height);
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
`

// 前缀图标信息
export const YearBackStyles = styled.span`
    cursor: pointer;
    margin-right: 10px;
    margin-left: 10px;
    ::before {
        display: inline-block;
        content: ' ';
        width: 7px;
        height: 7px;
        border-left: 1px solid #d3d3d3;
        border-bottom: 1px solid #d3d3d3;
        transform: rotate(45deg);
    } 

    ::after {
        display: inline-block;
        content: ' ';
        width: 7px;
        height: 7px;
        border-left: 1px solid #d3d3d3;
        border-bottom: 1px solid #d3d3d3;
        transform: rotate(45deg);
    }
`

export const MonthBackStyles = styled.span`
    cursor: pointer;
    ::before {
        display: inline-block;
        content: ' ';
        width: 7px;
        height: 7px;
        border-left: 1px solid #d3d3d3;
        border-bottom: 1px solid #d3d3d3;
        transform: rotate(45deg);
    } 
`

export const MonthForwardStyles = styled.span`
    cursor: pointer;
    ::before {
        display: inline-block;
        content: ' ';
        width: 7px;
        height: 7px;
        border-top: 1px solid #d3d3d3;
        border-right: 1px solid #d3d3d3;
        transform: rotate(45deg);
    } 
`

export const YearForwardStyles = styled.span`
    cursor: pointer;
    margin-right: 10px;
    margin-left: 10px;
    ::before {
        display: inline-block;
        content: ' ';
        width: 7px;
        height: 7px;
        border-top: 1px solid #d3d3d3;
        border-right: 1px solid #d3d3d3;
        transform: rotate(45deg);
    } 

    ::after {
        display: inline-block;
        content: ' ';
        width: 7px;
        height: 7px;
        border-top: 1px solid #d3d3d3;
        border-right: 1px solid #d3d3d3;
        transform: rotate(45deg);
    }
`

export const HeaderViewStyles = styled.span`
    flex: 1;
    text-align: center;
    cursor: default;
`

export const DatePickerBodyStyled = styled.div`
    height: calc(100% - var(--header-height));
    margin: 8px 10px;
`

// 日期框body的内容信息
export const BodyHeaderStyled = styled.div`
    cursor: default;
    display: inline-block;
    width: 36px;
    height: 36px;
    text-align: center;
`

// cell 单元格
export const BodyCellStyled = styled.div.attrs(() => {
})`
    cursor: pointer;
    display: inline-block;
    width: 36px;
    height: 36px;
    text-align: center;
    line-height: 36px;
    color: ${props => props.isCurrentMonth ? 'unset': 'rgba(0,0,0, .4)'};
    :hover {
        background: #f5f5f5;
    }
    
`

export const CellTextStyled = styled.span.attrs(props => {
})`
    line-height: 24px;
    border: ${props => {
        if (props.isToday) {
            return `1px solid ${props.theme.colorPrimary}`;
        }
        return 'unset';
    }};
    padding: 4px;
    user-select: none;
    border-radius: 2px;
`

export const DatePickerPanelStyled = styled.div`
    width: 280px;
    height: 310px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0px 0px 4px rgba(0,0,0, .1);
    --header-height: 41px;
`;
