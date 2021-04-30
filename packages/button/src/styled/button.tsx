import { HTMLAttributes } from 'react';
import styled from 'styled-components';

interface StyledButtonProps extends HTMLAttributes<HTMLButtonElement> {
}

export const StyledButton = styled.button.attrs((props: StyledButtonProps) => {
})`
    text-align: center;
    position: relative;
    overflow: hidden;
    text-decoration:none;
    vertical-align: middle;
    padding: 4px 15px;
    height: 32px;
    font-weight: 500;
    font-size: .875rem;
    user-select: none;
    :hover{
    }
    :active {
        ::before {
            display: inline;
            transform:  scale(5);
        }
    }
    ::before{
        z-index: 1;
        display: none;
        position: absolute;
        content: ' ';
        left: 0px;
        width: 100%;
        height: 100%;
        background-image: radial-gradient(
            rgba(15, 6, 6, 0.2) 0px, 
            rgba(255, 255, 255, 0.3) 40%, 
            rgba(255, 255, 255, 0.4) 50%, 
            rgba(255, 255, 255, 0.5) 60%, 
            rgba(255, 255, 255, 0) 70%
        );
    }
`;
