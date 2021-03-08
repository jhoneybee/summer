import React, { useState } from 'react';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';

import Input, { IconStyles, InputProps } from './input';


export interface PasswordProps extends InputProps{

}

export default function Password ({
    style,
    ...restProps
}: PasswordProps) {
    const [hideValue, setHideValue] = useState<boolean>(true);
    return (
        <div
            style={{
                ...style,
                position: 'relative',
                display: 'inline-block',
            }}
        >
            <Input type={hideValue ? 'password' : 'text'} {...restProps} />
            <IconStyles
                onClick={() => {
                    setHideValue(!hideValue);
                }}
            >
                { hideValue ? <AiOutlineEyeInvisible /> : <AiOutlineEye /> } 
            </IconStyles>
        </div>
    );
}