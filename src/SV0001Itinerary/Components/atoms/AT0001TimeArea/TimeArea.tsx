// import { useTranslation } from 'react-i18next';
import { StyledInput } from './style'
import React, { FC, useEffect, useState, FocusEvent, ChangeEvent, KeyboardEvent } from 'react';

type TimeAreaProps = {
    className: string;
    span: Date | null;
    hourUnit: string;
    minUnit: string;
    inputProps: { [key: string]: any }; //役割???
}

export const AT0001TimeArea: FC<TimeAreaProps> = ({
    className,
    span,
    hourUnit = ':',
    minUnit = '',
    inputProps,
}) => {
    const [time, setTime] = useState<[number, number]>([0,0]); //[hour, min]
    useEffect(() => {
        if(span){ setTime([span?.getHours(), span?.getMinutes()]); }
    }, [span]);
    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        // if(!!onClick){
        //     onClick();
        // }
        event.target.select();
    }
    const handleChanged = (event: ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        let displayString = display();
        let timeNum = parseInt(time.join(''));
        if(!value){
            timeNum = 0;
        }else if(value===displayString.substr(0,displayString.length-1)){
            timeNum = Math.floor(timeNum/10)
        }else{
            let inputNum = parseInt(value[value.length - 1])
            if(isNaN(inputNum)){ return; }
            else if((displayString+inputNum)===value){
                timeNum = (timeNum*10 + inputNum) % 10000;
            }else{
                timeNum = inputNum;
            }
        }
        let [hour, min] = [Math.floor(timeNum / 100) % 100, timeNum % 100];
        if (min > 23 && min % 10 > 6) { min %= 10; }
        if (hour > 23) { hour %= 10; }
        setTime([hour, min]);
    };
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if(event.key === ''){
            // event.target; 
            return;
        }
    }
    const display = () => {
        let [hour, min] = time.map((x) => (String(x).padStart((!minUnit) ? 2 : 1, '0')));
        if (parseInt(hour)!=0 || !minUnit) {
            return (hour + hourUnit + (parseInt(min)!=0 || !minUnit ? min : ''));
        } else {
            return (min + minUnit);
        }
    }
    return (
        <>
            <StyledInput
                size='small'
                inputProps={{
                    ...inputProps,
                    'type': 'tel',
                    'value': display(),
                    'onFocus': handleFocus,
                    'onChange': handleChanged,
                    'onKeyDown': handleKeyDown,
                    'time': time,
                }}
                className={className}
            />
        </>
    );
};
export default AT0001TimeArea;