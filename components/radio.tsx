import React, { InputHTMLAttributes, createContext, Dispatch, useReducer, useContext } from 'react';
import styled from 'styled-components';

import { borderDefaultStyle, primaryColor } from './styles/global';


type Action = { type: 'setValue', payload: string | number }

interface State {
    value?: string | number
}

const Context = createContext<{
    state: State;
    dispatch: Dispatch<Action>;
}>({
    state: {},
    dispatch: () => null
});

function reducer(state: State, action: Action): State {
    const type = action.payload;
    switch (action.type) {
        case 'setValue':
            return {
                ...state,
                value: action.payload
            };
        default:
            throw Error(`Unknown type [${type}]`);
    }
}

const RadioStyled = styled.input.attrs(props => {
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
    border: ${borderDefaultStyle};
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
        background-color: ${primaryColor};
        visibility: ${props => props.select ? 'visible' : 'hidden'};
    }
`;

const ContentStyled = styled.div`
    display: inline-flex;
    align-items: center;
`


interface RadioItemProps extends InputHTMLAttributes<HTMLInputElement> {
    value: string | number
}

export const RadioItem = ({
    value,
    children,
    ...restProps
}: RadioItemProps) => {
    const { state, dispatch } = useContext(Context);
    return (
        <>
            <RadioStyled
                {...restProps}
                type='radio'
                select={value === state.value && state.value }
                onClick={() => {
                    console.log(value)
                    dispatch({
                        type: 'setValue',
                        payload: value
                    })
                }}
            />
            {children}
        </>
    )
}

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
    value: string | number
}

export default function Radio ({
    value,
    children,
    ...restProps
}: RadioProps) {
    const [state, dispatch] = useReducer(reducer, {
        value,
    })
    return (
        <Context.Provider
            value={{
                state,
                dispatch
            }}
        >
            <ContentStyled {...restProps}>
                {children}
            </ContentStyled>
        </Context.Provider>
    );
}