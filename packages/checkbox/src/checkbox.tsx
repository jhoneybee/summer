import React, { InputHTMLAttributes, useState } from 'react';

import { CheckboxStyled, ContentStyled } from './styled'

export interface CheckboxProps extends  Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
    checked?: boolean
}

/**
 * 多选框
 */
export default function Checkbox ({
    style,
    className,
    children,
    checked,
    onChange,
    ...restProps
}: CheckboxProps) {
    const [value, setValue] = useState<boolean>(false);
    return (
        <ContentStyled
            className={className}
            style={style}
        >
            <CheckboxStyled
                {...restProps}
                type='checkbox'
                checked={checked !== undefined ? checked : value}
                onChange={(event) => {
                    setValue(event.target.checked);
                    onChange?.(event);
                }}
            />
            {children}
        </ContentStyled>
    );
}