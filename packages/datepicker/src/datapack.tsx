import React, {
    HTMLAttributes,
    ReactNode,
    useEffect,
    useState,
    useRef,
    createContext,
    Dispatch,
    useReducer,
    InputHTMLAttributes
} from 'react';

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

import { Input } from '@summer/input';
import { DropDown } from '@summer/dropdown';

import {
    DatePickerHeaderStyled,
    YearBackStyles,
    MonthBackStyles,
    MonthForwardStyles,
    YearForwardStyles,
    HeaderViewStyles,
    DatePickerBodyStyled,
    BodyHeaderStyled,
    BodyCellStyled,
    CellTextStyled,
    DatePickerPanelStyled
} from './styled'


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

interface DatePickerHeader {
    value: Date;
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
            const datetime: string = event.currentTarget?.getAttribute('data-time') as string
            onChange?.(new Date(Number.parseInt(datetime)));
        }

        const startDateTime = addDays(value!, -getDate(value!) + 1); 
        const endDateTime = addDays(startDateTime, getDaysInMonth(value!) - 1);
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
            newDays.push(cellDom);
            currentTime = addDays(currentTime, 1);
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
    /** 值 */
    value?: Date | null
    /** 格式化时间 */
    format?: string
    /** 是否允许小图标清除 */
    allowClear?: boolean
    /** 是否禁用*/
    disabled?: boolean
    /** 值改变时候触发的事件 */
    onChange?: (changeValue: Date | undefined) => void
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

    const [unValue, setUnValue] = useState<Date>();

    const [state, dispatch] = useReducer(datePickerReducer, {
        visible: false,
    })
    const [hover, setHover] = useState<boolean>(false);

    const getRealValue = () => {
        const realValue = value === undefined ? unValue : value;
        return realValue instanceof Date ? format(realValue, datePickerFormat) : '' 
    } 

    const getRealValueData = () => {
        return value === undefined ? unValue : value;
    }

    const changeValue = (changeValue: Date | undefined) => {
        if (value === undefined) {
            setUnValue(changeValue);
        } else {
            onChange?.(changeValue);
        }
    } 


    const input = useRef<HTMLInputElement>();

    
    const [top, setTop] = useState<number>(0)


    useEffect(() => {
        if (input.current) {
            const { height } = input.current.getBoundingClientRect();
            setTop(height + 2)
        }
    }, [])

    return (
        <Context.Provider
            value={{
                state,
                dispatch
            }}
        >
            <div
                style={{
                    position: 'relative'
                }}
            >
                <DropDown
                    style={{
                        left: 0,
                        top
                    }}
                    overlay={
                        <DatePickerPanel
                            value={getRealValueData()!}
                            onChange={(cValue: Date) => {
                                dispatch({
                                    type: 'setVisible',
                                    payload: false
                                })
                                changeValue(cValue);
                            }}
                        />
                    }
                    onChange={(changeVisible: boolean) => {
                        dispatch({
                            type: 'setVisible',
                            payload: changeVisible
                        })
                    }}
                    onMouseDown={(event: { preventDefault: () => void; }) => {
                        event.preventDefault();
                    }}
                    visible={state.visible}
                >
                    <Input
                        containerRef={input}
                        suffix={
                            hover && getRealValue() && allowClear ? (
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
                        onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
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

                        onClick={(event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
                            dispatch({
                                type: 'setVisible',
                                payload: true
                            })
                            onClick?.(event);
                        }}
                        onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                            dispatch({
                                type: 'setVisible',
                                payload: false
                            })
                            onBlur?.(event);
                        }}
                    />
                </DropDown>
            </div>
        </Context.Provider>
    );
}