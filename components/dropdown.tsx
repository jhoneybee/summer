import React, { cloneElement, ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export interface DropDownProps {
    children?: JSX.Element,
    overlay?: ReactNode
}

const DropDownStyled = styled.div.attrs((props) => {
})`
    z-index: 1000;
    position: fixed;
    left: ${props => `${props.rect?.x || 0}px`};
    top: ${props => `${(props.rect?.y || 0) + (props.rect?.height || 0)}px`};
    background-color: #fff;
    padding: 5px;
    box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.15);
`;


export default function DropDown ({
    children,
    overlay,
}: DropDownProps) {
    const [show, setShow] = useState<boolean>(false);
    const [rect, setRect] = useState<DOMRect>(null);

    const ref = useRef<HTMLElement>(null);
    const dropdownRef = useRef<HTMLElement>(null);

    const { onMouseOver, onMouseOut, ...restProps } = children.props;

    useEffect(() => {
        const setRectState = () => {
            setRect(ref.current?.getBoundingClientRect());
        }

        const rectInterval = setInterval(() => {
            setRectState();
        }, 10)

        const observer = new IntersectionObserver(() => {
            dropdownRef.current?.blur();
        });
        observer.observe(ref.current);
        return () => {
            clearInterval(rectInterval);
            observer.disconnect();
        }
    }, [])

    useEffect(() => {
        dropdownRef.current?.focus();
    }, [show])


    useEffect(() => {
        setRect(ref.current?.getBoundingClientRect());
    }, [ref.current])

    const dom = cloneElement(children, {
        ...restProps,
        ref: ref,
        onMouseOver: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            setShow(true);
            onMouseOver?.(event);
        }
    })

    return (
        <>
            {
                show ? (
                    <DropDownStyled
                        tabIndex="0"
                        ref={dropdownRef}
                        rect={rect}
                        onBlur={() => {
                            setShow(false);
                        }}
                    >
                        {overlay}
                    </DropDownStyled>
                ) : undefined
            }
            {dom}
        </>
    ) 
    
}