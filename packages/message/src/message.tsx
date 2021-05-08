import React, { HTMLAttributes, ReactNode, useState } from 'react';
import ReactDOM from 'react-dom';


import {
    AiFillInfoCircle,
    AiFillCloseCircle,
    AiFillCheckCircle,
    AiOutlineLoading,
    AiOutlineClose
} from 'react-icons/ai';

import { ContainerStyled, ContentStyled, StateIconStyled, CloseIconStyled } from './styled'

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


let div: HTMLDivElement | null = null;
let time: NodeJS.Timeout | null = null;

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
            if (div) {
                ReactDOM.unmountComponentAtNode(div);
            }
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