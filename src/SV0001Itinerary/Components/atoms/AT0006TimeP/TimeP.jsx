import { useTranslation } from 'react-i18next';
import { StyledP } from './style.js'
import { useEffect, useState } from 'react';


export const AT0006TimeP = ({
    value,
    className,
    hourUnit = ':',
    minUnit = '',
    onClick,
    ...props
}) => {
    const { t } = useTranslation();
    const display = () => {
        let [hour, min] = [value && value.getHours(), value && value.getMinutes()].map((x) => (String(x).padStart((!minUnit) ? 2 : 1, '0')));
        if (parseInt(hour)!=0 || !minUnit) {
            return (hour + hourUnit + (parseInt(min)!=0 || !minUnit ? min : ''));
        } else {
            return (min + minUnit);
        }
    }
    return (
        <>
            <StyledP
                onClick={ onClick }
                className={ className }
            >
                { display() }
            </StyledP>
        </>
    );
};
export default AT0006TimeP;