import React, { HTMLAttributes, isValidElement, ReactNode } from 'react';
import styled from 'styled-components';


const SpaceItemStyled = styled.div`
    display: inline-block;
    margin-right: 1em;
`

export interface SpaceProps extends HTMLAttributes<HTMLDivElement>  {
}

export default function Space ({
    children
}: SpaceProps) {
    if (children instanceof Array && children.length > 1) {
        const element = [];
        children.forEach((node: JSX.Element) => {
            if (isValidElement(node)) {
                element.push(
                    <SpaceItemStyled
                        key={node.key}
                    >
                        {node}
                    </SpaceItemStyled> 
                )
            }
        })
        return (
            <>
                {element}
            </>
        );
    }
    return <> {children} </>;
}