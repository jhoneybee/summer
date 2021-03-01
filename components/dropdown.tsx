import React, { cloneElement, ReactNode, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

export interface DropDownProps {
    children?: JSX.Element,
    overlay?: ReactNode
}


const DropDownStyled = styled.div.attrs((props) => {
})`
    z-index: 1000;
    position: fixed;
    left: ${props => `${props.rect.x || 0}px`};
    top: ${props => `${(props.rect.y || 0) + (props.rect.height || 0)}px`};
    background-color: #fff;
    padding: 5px;
    box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.15);
`;


export default function DropDown ({
    children,
    overlay,
}: DropDownProps) {
    const [show, setShow] = useState<boolean>(false);

    const ref = useRef<HTMLElement>(null);

    const dom = cloneElement(children, {
        ...children.props,
        ref: ref,
        onMouseOver: () => {
            setShow(true);
        },
        onMouseOut: () => {
            setShow(false);
        }
    })

    return (
        <>
            {
                show ? (
                    <DropDownStyled
                        rect={ref.current?.getBoundingClientRect()}
                    >
                        {overlay}
                    </DropDownStyled>
                ) : undefined
            }
            
            {dom}
        </>
    ) 
    
}