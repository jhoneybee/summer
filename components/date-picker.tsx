import React, {
    HTMLAttributes,
    ReactNode,
    useEffect,
    useState,
    createContext,
    Dispatch,
    useReducer,
    InputHTMLAttributes
} from 'react';
import styled from 'styled-components';
import {
    format,
    addDays,
    getDate,
    getDay,
    getDaysInMonth,
    addYears,
    addMonths,
    getMonth,
} from 'date-fns';
import { AiOutlineCalendar, AiOutlineCloseCircle } from 'react-icons/ai';

import DropDown from './dropdown';
import Input from './input';

import { borderDefaultStyle, borderRadiusStyle, primaryColor } from './styles/global';


type Action = 
| { type: 'setVisible', payload: boolean }
;

interface State {
    visible: boolean
}

const Context = createContext<{
    state: State;
    dispatch: Dispatch<Action>;
  }>({
    state: {
        visible: false,
    },
    dispatch: () => null
});


function datePickerReducer(state: State, action: Action): State {
    const type = action.payload;
    switch (action.type) {
        case 'setVisible':
            return {
                ...state,
                visible: action.payload
            };
        default:
            throw Error(`reducer unknown type [${type}]`);
    }
}

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
        border-left: ${borderDefaultStyle};
        border-bottom: ${borderDefaultStyle};
        transform: rotate(45deg);
    } 

    ::after {
        display: inline-block;
        content: ' ';
        width: 7px;
        height: 7px;
        border-left: ${borderDefaultStyle};
        border-bottom: ${borderDefaultStyle};
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
        border-left: ${borderDefaultStyle};
        border-bottom: ${borderDefaultStyle};
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
        border-top: ${borderDefaultStyle};
        border-right: ${borderDefaultStyle};
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
        border-top: ${borderDefaultStyle};
        border-right: ${borderDefaultStyle};
        transform: rotate(45deg);
    } 

    ::after {
        display: inline-block;
        content: ' ';
        width: 7px;
        height: 7px;
        border-top: ${borderDefaultStyle};
        border-right: ${borderDefaultStyle};
        transform: rotate(45deg);
    }
`

const HeaderViewStyles = styled.span`
    flex: 1;
    text-align: center;
    cursor: default;
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
    color: ${props => props.isCurrentMonth ? 'unset': 'rgba(0,0,0, .4)'};
    
`

const CellTextStyled = styled.span.attrs(props => {
})`
    width: 24px;
    height: 24px;
    line-height: 24px;
    border: ${props => {
        if (props.isToday) {
            return `1px solid ${primaryColor()}`;
        }
        return 'unset';
    }};
    padding: 4px;
    user-select: none;
    border-radius: ${borderRadiusStyle};
    :hover {
        background: #f5f5f5;
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
            const datetime = event.currentTarget?.getAttribute('data-time')
            onChange?.(new Date(Number.parseInt(datetime)));
        }

        const startDateTime = addDays(value, -getDate(value) + 1); 
        const endDateTime = addDays(startDateTime, getDaysInMonth(value) - 1);
        const firstDateTime = addDays(startDateTime, -toNumberWeek(getDay(startDateTime)));

        const newDays: Array<ReactNode> = [];
        let currentTime = firstDateTime;
        let currentIndex = 0;
        while (currentTime.getTime() <= addDays(endDateTime, 6 - toNumberWeek(getDay(endDateTime))).getTime() || currentIndex <= 41) {
            currentIndex += 1;
            const cellDom = (
                <BodyCellStyled
                    title={format(currentTime, 'yyyy-MM-dd')}
                    data-time={currentTime.getTime()}
                    isCurrentMonth={getMonth(currentTime) === getMonth(startDateTime)}
                    key={currentTime.getTime()}
                    onMouseDown={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                        if (event.button === 0) {
                            cellClick(event)
                        }
                    }}
                >
                    <CellTextStyled
                        isToday={format(currentTime, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')}
                    >
                        {getDate(currentTime)}
                    </CellTextStyled>
                </BodyCellStyled>
            )
            newDays.push(cellDom)

            currentTime = addDays(currentTime, 1)
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
    border-radius: ${borderRadiusStyle};
    box-shadow: 0px 0px 4px rgba(0,0,0, .1);
    --header-height: 41px;
`;

interface DatePickerPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' > {
    // 当期的数据值 
    value?: Date
    onChange?: (changeValue: Date) => void
}

/**
 * 日期选择框的面板
 */
export const DatePickerPanel = ({
    value,
    onChange,
    ...restProps
}: DatePickerPanelProps) => {
    const [preValue, setPreValue] = useState<Date>(value || new Date());
    return (
        <DatePickerPanelStyled
            {...restProps}
        >
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

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value?: Date | null
    format?: string
    allowClear?: boolean
    disabled?: boolean
    onChange?: (changeValue: Date) => void
}

/**
 * 日期选择框
 */
export default function DatePicker ({
    value,
    format: datePickerFormat = 'yyyy-MM-dd', 
    readOnly = true,
    allowClear = true,
    disabled = false,
    onFocus,
    onBlur,
    onClick,
    onChange
}: DatePickerProps) {

    const [unValue, setUnValue] = useState(null);

    const [state, dispatch] = useReducer(datePickerReducer, {
        visible: false,
    })
    const [hover, setHover] = useState<boolean>(false);

    const getRealValue = () => {
        const realValue = value === undefined ? unValue : value;
        return realValue instanceof Date ? format(realValue, datePickerFormat) : '' 
    } 

    const changeValue = (changeValue: Date) => {
        if (value === undefined) {
            setUnValue(changeValue);
        } else {
            onChange?.(changeValue);
        }
    }

    return (
        <Context.Provider
            value={{
                state,
                dispatch
            }}
        >
            <DropDown
                trigger='none'
                width={280}
                overlay={
                    <DatePickerPanel
                        value={value}
                        onChange={(cValue: Date) => {
                            dispatch({
                                type: 'setVisible',
                                payload: false
                            })
                            changeValue(cValue);
                        }}
                    />
                }
                onChangeVisible={(changeVisible) => {
                    dispatch({
                        type: 'setVisible',
                        payload: changeVisible
                    })
                }}
                onMouseDown={(event) => {
                    event.preventDefault();
                }}
                visible={state.visible}
            >
                <Input
                    suffix={
                        hover && value && allowClear ? (
                            <AiOutlineCloseCircle
                                onMouseEnter={() => {
                                    setHover(true);
                                }}
                                onMouseLeave={() => {
                                    setHover(false);
                                }}
                                onClick={() => {
                                    changeValue(undefined);
                                }}
                            
                            />
                        ) : <AiOutlineCalendar />
                    }
                    value={getRealValue()}
                    readOnly={readOnly}
                    disabled={disabled}
                    onFocus={(event) => {
                        dispatch({
                            type: 'setVisible',
                            payload: true
                        })
                        onFocus?.(event);
                    }}

                    onMouseOver={() => {
                        setHover(true);
                    }}

                    onMouseOut={() => {
                        setHover(false);
                    }}

                    onClick={(event) => {
                        dispatch({
                            type: 'setVisible',
                            payload: true
                        })
                        onClick?.(event);
                    }}
                    onBlur={(event) => {
                        dispatch({
                            type: 'setVisible',
                            payload: false
                        })
                        onBlur?.(event);
                    }}
                />
            </DropDown>
        </Context.Provider>
    );
}