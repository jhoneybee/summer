import React, { HTMLAttributes, ReactNode, useState } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';

import {
    AiFillInfoCircle,
    AiFillCloseCircle,
    AiFillCheckCircle,
    AiOutlineLoading,
    AiOutlineClose
} from 'react-icons/ai';


import { rotate, fallMessage, closeMessage } from './animation';

const ContainerStyled = styled.div.attrs(props => {
})`
    width: 100%;
    display: flex;
    justify-content: center;
    animation: ${props => {
        if (props.animation) {
            return props.animation === 'show' ? css`${fallMessage} .2s`: css`${closeMessage} .2s`
        }
        return 'unset';
    }} ;
    animation-fill-mode: forwards;
`;

const ContentStyled = styled.div.attrs((props) => {
})`
    display: flex;
    align-items: center;
    position: relative;
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
    background: #fff;
    padding: 8px 25px 8px 20px;
    font-size: 14px;
    line-height: 1.5715;
`;

const getIconColor = (type: string) => {
    if (type === 'info' || type === 'loading') {
        return '#1890ff';
    } else if (type === 'warn') {
        return '#faad14';
    } else if (type === 'error') {
        return '#ff4d4f';
    } else if (type === 'success') {
        return '#52c41a';
    }
    return 'unset';
}

const IconStyled = css`
    display: flex;
    align-items: center;
    padding-right: .5em;
    > svg {
        height: 16px;
        width: 16px;
        color: ${(props: any) => getIconColor(props.type)};
        animation: ${rotate} ${(props: any) => props.type === 'loading' ? '.9s' : '0s' } linear infinite;
    }
`;
const StateIconStyled = styled.i.attrs(props => {
})`
    ${IconStyled}
`

// 关闭的icon信息
const CloseIconStyled = styled.i.attrs(props => {
})`
    ${IconStyled}
    cursor: pointer;
    margin-left: 1em;
    opacity: .5;
    position: absolute;
    right: 0px;
    visibility: ${props => props.isHover ? 'visible' : 'hidden'};
`;

export interface MessageProps extends HTMLAttributes<HTMLDivElement> {
    type?: 'success' | 'error' | 'info' | 'warn' | 'loading'
    animation?: 'show' | 'close'
    onClose?: () => void
}

const Message = ({
    children,
    type = 'info',
    animation,
    onClose,
    ...restProps
}: MessageProps) => {
    const [hover, setHover] = useState<boolean>(false)

    let icon = <AiFillInfoCircle />;

    if (type === 'info' || type === 'warn') {
        icon = <AiFillInfoCircle />;
    } else if (type === 'error') {
        icon = <AiFillCloseCircle />;
    } else if (type === 'success') {
        icon = <AiFillCheckCircle />;
    } else if (type === 'loading') {
        icon = <AiOutlineLoading />;
    }

    return  (
        <ContainerStyled animation={animation} {...restProps}  >
            <ContentStyled
                onMouseEnter={() => {
                    setHover(true);
                }}
                onMouseLeave={() => {
                    setHover(false);
                }}
            >
                <StateIconStyled
                    type={type}
                >
                    {icon}
                </StateIconStyled>    
                {children}
                <CloseIconStyled
                    isHover={hover}
                    onClick={() => {
                        onClose?.();
                    }}
                    onMouseEnter={() => {
                        setHover(true);
                    }}
                    onMouseLeave={() => {
                        setHover(false);
                    }}
                >
                    <AiOutlineClose />
                </CloseIconStyled>
                
            </ContentStyled>
        </ContainerStyled>
    );
}


let div = null;
let time = null;

export const show = (
    type: 'success' | 'error' | 'info' | 'warn' | 'loading',
    content: ReactNode,
    duration: number = 3,
    onClose?: () => void
) => {
    if (!div) {
        div = document.createElement('div');
        div.style.setProperty('z-index', '1020');
        div.style.setProperty('width', '100%');
        div.style.setProperty('position', 'fixed');
        div.style.setProperty('top', '20px');
        document.body.appendChild(div);
    }

    const closeMessage = (() => {
        ReactDOM.render(
            <Message
                type={type}
                animation='close'
            >
                {content}
            </Message>
        , div);
        time = null;
        setTimeout(() => {
            ReactDOM.unmountComponentAtNode(div);
        }, 250)
    })
    if (duration > 0) {
        if (time) {
            clearTimeout(time);
        }

        time = setTimeout(() => {
            closeMessage();
            onClose?.();
        }, duration * 1000)
    }

    ReactDOM.render(
        <Message
            type={type}
            animation='show'
            onClose={() => {
                closeMessage();
            }}
        >
            {content}
        </Message>
    , div);
}

export const info = (content: ReactNode, duration: number = 3, onClose?: () => void) => {
    show('info', content, duration, onClose);
}

export const error = (content: ReactNode, duration: number = 3, onClose?: () => void) => {
    show('error', content, duration, onClose);
}

export const warn = (content: ReactNode, duration: number = 3, onClose?: () => void) => {
    show('warn', content, duration, onClose);
}

export const success = (content: ReactNode, duration: number = 3, onClose?: () => void) => {
    show('success', content, duration, onClose);
}

export const loading = (content: ReactNode, duration: number = 3, onClose?: () => void) => {
    show('loading', content, duration, onClose);
}

export default Message;