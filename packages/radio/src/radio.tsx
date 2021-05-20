import React, {
    InputHTMLAttributes,
    createContext,
    Dispatch,
    useReducer,
    useContext,
    useEffect,
} from 'react';

import { RadioStyled, ContentStyled } from './styled'

type Action = { type: 'setValue', payload: string | number }

interface State {
    value?: string | number
}

export const Context = createContext<{
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
            throw Error(`reducer unknown type [${type}]`);
    }
}


interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
    value: string | number
}

export const Radio = ({
    value,
    children,
    ...restProps
}: RadioProps) => {
    const { state, dispatch } = useContext(Context);
    return (
        <>
            <RadioStyled
                {...restProps}
                type='radio'
                select={value === state.value && state.value }
                onClick={() => {
                    if (value !== state.value) {
                        dispatch({
                            type: 'setValue',
                            payload: value
                        });
                    }
                }}
            />
            {children}
        </>
    )
}

interface RadioGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value?: string | number
    onChange?: (changeValue: string | number) => void
}

export default function RadioGroup ({
    value,
    children,
    onChange,
    ...restProps
}: RadioGroupProps) {
    const [state, dispatch] = useReducer(reducer, {
        value,
    });

    useEffect(() => {
        onChange?.(state.value!);
    }, [state.value]);

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