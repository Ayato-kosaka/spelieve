import { StyledInput } from './style'
import React, { FC } from 'react';

type TItleAreaProps = {
    className: any;  // 一旦any
    onFocusout: any; // 一旦any
};

export const AT0002TitleArea: FC<TItleAreaProps> = ({
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
