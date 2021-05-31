import React, { useState } from 'react';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';

import { Input, InputProps } from '@jhoneybee/input';

export interface PasswordProps extends InputProps{
}

export default function Password ({
    style,
    ...restProps
}: PasswordProps) {
    const [hideValue, setHideValue] = useState<boolean>(true);
    const Icon = hideValue ? AiOutlineEyeInvisible : AiOutlineEye;
    return (

            <Input
                {...restProps}
                type={hideValue ? 'password' : 'text'}
                suffix={
                    <Icon
                        onClick={() => {
                            setHideValue(!hideValue);
                        }}
                    />
                }
            />
    );
}