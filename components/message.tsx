import React, { HTMLAttributes, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import {
    AiFillInfoCircle,
    AiFillCloseCircle,
    AiFillCheckCircle,
    AiOutlineLoading
} from 'react-icons/ai';


import { rotate, fallMessage, closeMessage } from './animation';


const ContainerStyled = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

const ContentStyled = styled.div.attrs((props) => {

})`
    display: flex;
    align-items: center;
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
    background: #fff;
    padding: 8px 14px;
    font-size: 14px;
    line-height: 1.5715;
    animation: ${props => props.close ?  closeMessage : fallMessage} .2s;
    animation-fill-mode:forwards;

`;

const getIconColor = (type: string) => {
    if (type === 'info' || type === 'loading') {
        return '#1890ff';
    } else if (type === 'warning') {
        return '#faad14';
    } else if (type === 'error') {
        return '#ff4d4f';
    } else if (type === 'success') {
        return '#52c41a';
    }
    return 'unset';
}

const IconStyled = styled.i.attrs(props => {
})`
    display: flex;
    align-items: center;
    padding-right: .5em;
    > svg {
        height: 16px;
        width: 16px;
        color: ${props => getIconColor(props.type)};
        animation: ${rotate} ${(props) => props.type === 'loading' ? '.9s' : '0s' } linear infinite;
    }
`

export interface MessageProps extends HTMLAttributes<HTMLDivElement> {
    type?: 'success' | 'error' | 'info' | 'warning' | 'loading'
    close?: boolean
}

const Message = ({
    children,
    close = false,
    type = 'info',
    ...restProps
}: MessageProps) => {
    let icon = <AiFillInfoCircle />;

    if (type === 'info' || type === 'warning') {
        icon = <AiFillInfoCircle />;
    } else if (type === 'error') {
        icon = <AiFillCloseCircle />;
    } else if (type === 'success') {
        icon = <AiFillCheckCircle />;
    } else if (type === 'loading') {
        icon = <AiOutlineLoading />;
    }

    return  (
        <ContainerStyled {...restProps} >
            <ContentStyled
                close={close}
            >
                <IconStyled
                    type={type}
                >
                    {icon}
                </IconStyled>    
                {children}
            </ContentStyled>
        </ContainerStyled>
    );
}


let div = null;
let time = null;

export const show = (
    type: 'success' | 'error' | 'info' | 'warning' | 'loading',
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

    if (duration > 0) {
        if (time) {
            clearTimeout(time);
        }

        time = setTimeout(() => {
            ReactDOM.render(
                <Message
                    type={type}
                    close={true}
                >
                    {content}
                </Message>
            , div);
            time = null;
            setTimeout(() => {
                ReactDOM.unmountComponentAtNode(div);
            }, 250)
            onClose?.();
        }, duration * 1000)
    }

    ReactDOM.render(
        <Message
            type={type}
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

export const warning = (content: ReactNode, duration: number = 3, onClose?: () => void) => {
    show('warning', content, duration, onClose);
}

export const success = (content: ReactNode, duration: number = 3, onClose?: () => void) => {
    show('success', content, duration, onClose);
}

export const loading = (content: ReactNode, duration: number = 3, onClose?: () => void) => {
    show('loading', content, duration, onClose);
}

export default Message;