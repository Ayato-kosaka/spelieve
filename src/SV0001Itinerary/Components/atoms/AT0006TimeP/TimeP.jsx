import { useTranslation } from 'react-i18next';
import { Styled_p } from './style.js'
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
        let [hour, min] = [value.getHours(), value.getMinutes()];
        if (parseInt(hour)!=0 || !minUnit) {
            return (hour + hourUnit + (parseInt(min)!=0 || !minUnit ? min : ''));
        } else {
            return (min + minUnit);
        }
    }
    return (
        <>
            <Styled_p
                onClick={ onClick }
                className={ className }
            >
                { display() }
            </Styled_p>
        </>
    );
};
export default AT0006TimeP;