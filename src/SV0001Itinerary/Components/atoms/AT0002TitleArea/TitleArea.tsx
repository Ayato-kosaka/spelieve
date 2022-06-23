import { StyledInput } from './style'
import React, { FC } from 'react';

type TitleAreaProps = {
    className: string;  // 一旦any
    onFocusout: any; // 一旦any
};

export const AT0002TitleArea: FC<TitleAreaProps> = ({
    className,
    onFocusout
}) => {
    return (
        <StyledInput 
            type='text' 
            className={className}
            onBlur={onFocusout} 
        />
    )
}
