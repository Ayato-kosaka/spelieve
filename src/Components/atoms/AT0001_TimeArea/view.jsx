import { Styled_input, Styled_p } from './style.js'
import React, { useEffect, useState } from "react";

const anyToTime = (x) => {
    if (!x) { return (0) }
    let val = 0;
    switch (x.constructor.name) {
        case 'Number':
            val = new Date(0, 0, 0, ...timeToList(x % 10000));
            break;
        case 'String':
            val = new Date(0, 0, 0, ...timeToList(stringToTime(x)));
            break;
        case 'Date':
            val = x;
            break;
        default:
            val = new Date();
    }
    return (val.getHours() * 100 + val.getMinutes())
}

const stringToTime = (s) => {
    let filtered = s.split('').filter(x => !isNaN(x)).join('');
    if (!filtered) { filtered = '0' }
    return (parseInt(filtered) % 10000);
}

export const timeToList = (v) => {
    return ([Math.floor(v / 100) % 100, v % 100])
}

export const AT0001_TimeArea = ({
    isInput = true,
    onFocusout,
    className,
    inputProps,
    hourUnit = ':',
    minUnit = '',
    ...props
}) => {
    const [time, setTime] = useState([]);//[min, hour]
    useEffect(() => {
        setTime(anyToTime(props.value));
    }, [props.value]);
    const handleFocus = (event) => event.target.select();
    const handleChanged = event => {
        let val = stringToTime(event.target.value);
        let [hour, min] = timeToList(val);
        if (min > 23 && min % 10 > 6) { min %= 10; }
        if (hour > 23) { hour %= 10; }
        setTime(hour * 100 + min);
    };
    const display = () => {
        let [hour, min] = timeToList(time).map((x) => (String(x).padStart(2, '0')))
        if (hour !== '00' || minUnit === '') {
            return (hour + hourUnit + (min !== '00' || minUnit === '' ? (min) : ''));
            //return (hour + ' ' + hourUnit + (min !== '00' || minUnit === '' ? (' ' + min) : ''));
        } else {
            return (min + minUnit);
            //return (min + ' ' + minUnit);
        }
    }
    return (
        <>
            {isInput ?
                <Styled_input
                    size="small"
                    inputProps={{
                        ...inputProps,
                        "type": "tel",
                        "value": display(),
                        "onFocus": handleFocus,
                        "onChange": handleChanged,
                        "time": time
                    }}
                    className={className}
                />
                :
                <Styled_p className={className}>{display()}</Styled_p>
            }
        </>
    );
};