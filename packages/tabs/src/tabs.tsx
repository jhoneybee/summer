import React, {
    createContext,
    Dispatch,
    HTMLAttributes,
    isValidElement,
    ReactNode,
    useEffect,
    useReducer
} from 'react';
import styled from 'styled-components';

import { TabsHeaderItemStyled, TabsHeaderWrapStyled } from './styled'

type Action = 
| { type: 'setActive', payload: string | number }
| { type: 'setHeadersAndContent', payload: { headers: Array<ReactNode>, content: ReactNode}}

interface State {
    activeKey?: string | number
    headers: Array<ReactNode>
    content: ReactNode
}

export const Context = createContext<{
    state: State;
    dispatch: Dispatch<Action>;
}>({
    state: {
        headers: [],
        content: null
    },
    dispatch: () => null
});

function reducer(state: State, action: Action): State {
    const type = action.payload;
    switch (action.type) {
        case 'setActive':
            return {
                ...state,
                activeKey: action.payload
            };
        case 'setHeadersAndContent':
            return {
                ...state,
                ...action.payload
            }
        default:
            throw Error(`reducer unknown type [${type}]`);
    }
}

const TabsHeaderWrap = ({
    children
}: HTMLAttributes<HTMLDivElement>) => {
    return (
        <TabsHeaderWrapStyled>
            {children}
        </TabsHeaderWrapStyled>
    );
}

const TabsContentStyled = styled.div`
    min-height: 300px;
`;

const TabsContent = (props: HTMLAttributes<HTMLDivElement> ) => {
    return (
        <TabsContentStyled {...props} />
    )
}

const ContainerStyled = styled.div`
`;

export interface TabPaneProps extends HTMLAttributes<HTMLDivElement> {
    tab: string;
}

export const TabPane = ({
}: TabPaneProps) => {
    return null;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement>{
    activeKey?: string | number;
}

export default function Tabs ({
    children,
    activeKey,
    ...restProps
}: TabsProps) {

    const [state, dispatch] = useReducer(reducer, {
        activeKey,
        headers: [],
        content: null
    });

    const onClick = (key: string | number) => {
        dispatch({
            type: 'setActive',
            payload: key
        })
    }

    const loops = () => {
        if (children instanceof Array) {
            const headers: JSX.Element[] =  [];
            let content: ReactNode;
            children.forEach(element => {
                if (isValidElement(element)) {
                    if (element.key === state.activeKey) {
                        content = element.props.children;
                    }
                    headers.push(
                        <TabsHeaderItemStyled
                            key={element.key}
                            isActive={element.key === state.activeKey}
                            onClick={() => {
                                onClick(element.key!);
                            }}
                        >
                            {element.props.tab}
                        </TabsHeaderItemStyled>
                    );
                }
            });
            dispatch({
                type: 'setHeadersAndContent',
                payload: {
                    headers,
                    content,
                }
            })

        } else if (isValidElement(children)) {
            const headers =  [];
            headers.push(
                <TabsHeaderItemStyled
                    key={children.key}
                    isActive={children.key === state.activeKey}
                    onClick={() => {
                        onClick(children.key!);
                    }}
                >
                    {children.props.tab}
                </TabsHeaderItemStyled>
            );
            dispatch({
                type: 'setHeadersAndContent',
                payload: {
                    headers,
                    content: children.key === state.activeKey ? undefined : children.props.children
                }
            })
        }
    }

    useEffect(() => {
        loops();
    }, [state.activeKey, children])

    return (
        <Context.Provider
            value={{
                state,
                dispatch
            }}
        >
            <ContainerStyled
                {...restProps}
            >
                <TabsHeaderWrap>
                    {state.headers}
                </TabsHeaderWrap>
                <TabsContent>
                    {state.content}
                </TabsContent>
            </ContainerStyled>
        </Context.Provider>

    );
}