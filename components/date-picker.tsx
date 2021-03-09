import React, { HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';

import { disabledColor } from './styles/global'

import {
    format,
    addDays,
    getDate,
    getDay,
    getDaysInMonth,
    addYears,
    addMonths,
    getMonth,
} from 'date-fns'

const DatePickerHeaderStyled = styled.div`
    display: flex;
    align-items: center;
    height: var(--header-height);
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
`

// 前缀图标信息
const YearBackStyles = styled.span`
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

const MonthBackStyles = styled.span`
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

const MonthForwardStyles = styled.span`
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

const YearForwardStyles = styled.span`
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

const HeaderViewStyles = styled.span`
    flex: 1;
    text-align: center;
    cursor: pointer;
`

interface DatePickerHeader {
    value?: Date;
    onChange?: (changeValue: Date) => void;
}

/**
 * 日期选择框的头部信息
 */
const DatePickerHeader = ({
    value,
    onChange,
}: DatePickerHeader) => {
    return (
        <DatePickerHeaderStyled>
            <YearBackStyles
                onClick={() => {
                    onChange?.(addYears(value, -1));
                }}
            />
            <MonthBackStyles
                onClick={() => {
                    onChange?.(addMonths(value, -1))
                }}
            />
            <HeaderViewStyles> {format(value, 'yyyy年 MM月')} </HeaderViewStyles>
            <MonthForwardStyles
                onClick={() => {
                    onChange?.(addMonths(value, 1));
                }}
            />
            <YearForwardStyles
                onClick={() => {
                    onChange?.(addYears(value, 1));
                }}
            />
        </DatePickerHeaderStyled>
    );
}


const DatePickerBodyStyled = styled.div`
    height: calc(100% - var(--header-height));
    margin: 8px 10px;
`

// 日期框body的内容信息
const BodyHeaderStyled = styled.div`
    cursor: default;
    display: inline-block;
    width: 36px;
    height: 36px;
    text-align: center;
`

// cell 单元格
const BodyCellStyled = styled.div.attrs(() => {
})`
    cursor: pointer;
    display: inline-block;
    width: 36px;
    height: 36px;
    text-align: center;
    line-height: 36px;
    color: ${props => props.isCurrentMonth ? 'unset': disabledColor(props)};
    :hover {
        background: #f5f5f5;
        border-radius: 2px;
    }
`

interface DatePickerBodyProps {
    value?: Date;
    onChange?: (changeValue: Date) => void
}

const toNumberWeek = (num: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
    if (num === 0) {
        return 6;
    }
    return num -1;
}

/**
 * 日期选择的内容
 */
const DatePickerBody = ({
    value,
    onChange,
}: DatePickerBodyProps) => {
    const [days, setDays] = useState<Array<ReactNode>>();
    useEffect(() => {

        const cellClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            const datetime = event.currentTarget.getAttribute('data-time') as unknown as Date
            onChange?.(datetime);
        }

        const startDateTime = addDays(value, -getDate(value) + 1); 
        const endDateTime = addDays(startDateTime, getDaysInMonth(value) - 1);
        const firstDateTime = addDays(startDateTime, -toNumberWeek(getDay(startDateTime)));

        const newDays: Array<ReactNode> = [];
        let currentTime = firstDateTime;
        let currentIndex = 0;
        while (currentTime.getTime() <= addDays(endDateTime, 6 - toNumberWeek(getDay(endDateTime))).getTime() || currentIndex <= 41) {
            currentIndex += 1;
            currentTime = addDays(currentTime, 1)
            newDays.push(
                <BodyCellStyled
                    title={format(currentTime, 'yyyy-MM-dd') }
                    data-time={currentTime}
                    isCurrentMonth={getMonth(currentTime) === getMonth(startDateTime)}
                    key={currentTime.getTime()}
                    onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => cellClick(event)}
                >
                    {getDate(currentTime) }
                </BodyCellStyled>
            )

        }
        setDays(newDays);
    }, [value])
    return (
        <DatePickerBodyStyled>
            <BodyHeaderStyled>一</BodyHeaderStyled>
            <BodyHeaderStyled>二</BodyHeaderStyled>
            <BodyHeaderStyled>三</BodyHeaderStyled>
            <BodyHeaderStyled>四</BodyHeaderStyled>
            <BodyHeaderStyled>五</BodyHeaderStyled>
            <BodyHeaderStyled>六</BodyHeaderStyled>
            <BodyHeaderStyled>日</BodyHeaderStyled>
            {days}
        </DatePickerBodyStyled>
    );
}

const DatePickerPanelStyled = styled.div`
    width: 280px;
    height: 310px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0px 0px 4px rgba(0,0,0, .1);
    --header-height: 41px;
`;

interface DatePickerPanel extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' > {
    // 当期的数据值 
    value: Date
    onChange: (changeValue: Date) => void
}

/**
 * 日期选择框的面板
 */
export const DatePickerPanel = ({
    value = new Date(),
    onChange,
}: DatePickerPanel) => {

    const [preValue, setPreValue] = useState<Date>(value);

    return (
        <DatePickerPanelStyled>
            <DatePickerHeader
                value={preValue}
                onChange={(changeValue) => {
                    setPreValue(changeValue);
                }}
            />
            <DatePickerBody
                value={preValue}
                onChange={(changeValue) => {
                    onChange?.(changeValue);
                }}
            />
        </DatePickerPanelStyled>
    );
}

/**
 * 日期选择框
 */
export default function DatePicker () {
    return null;
}