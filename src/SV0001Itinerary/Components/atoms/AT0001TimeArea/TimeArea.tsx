import { StyledInput } from './style'
import React, { FC, useEffect, useState, FocusEvent, ChangeEvent } from 'react';
import * as HK0001Utils from 'SV0000Common/Hooks/HK0001Utils'

type AT0001TimeAreaProps = {
    className: string;
    dateTime: Date;
    inputProps: { 
        name: string;
        onBlur: (event: FocusEvent<HTMLInputElement> ) => void;
        autoFocus?: boolean;
     };
    displayValue: string;
}

export const AT0001TimeArea: FC<AT0001TimeAreaProps> = ({
    className,
    dateTime,
    inputProps,
    displayValue,
}) => {
    displayValue ||= HK0001Utils.formatDateToTime(dateTime);

    const [time, setTime] = useState<[number, number]>([0, 0]); //[hour, min]
    const date: Date = new Date(1970, 0, 1, ...time);

    const [isActive, setIsActive] = useState<boolean>(false);
    const [target, setTarget] = useState<HTMLInputElement>();

    useEffect(() => {
        if (dateTime) {
            setTime([dateTime.getHours(), dateTime.getMinutes()])
        };
    }, [dateTime]);
    
    // Focus in 後のレンダリングで、表示文字が変更されるため、handleFocus 内でなく、useEffect 内で target.select() する
    useEffect(() => {
        if (isActive) {
            target?.select();
        }
    }, [isActive]);

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        setIsActive(true);
        setTarget(event.target);
    };
    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        setIsActive(false);
        inputProps.onBlur(event);
    }

    const handleChanged = (event: ChangeEvent<HTMLInputElement>) => {
        const value: string = event.target.value;
        const timeNum: number = (() => {
            if (value.length === 0) {
                return 0;
            } else if (value === display().substr(0, display().length - 1)) { // BackSpace が入力された場合
                return Math.floor(parseInt(time.join('')) / 10)
            } else {
                const downedKey = parseInt(value[value.length - 1]);
                if (isNaN(downedKey)) {  // 数値以外が入力された場合
                    return NaN;
                } else if (value.length == 1) { // 入力済みの値を削除し数値が入力された場合
                    return downedKey;
                } else { // 数値が追加入力された場合
                    return (parseInt(time.join('')) * 10 + downedKey) % 10000;
                }
            }
        })();
        if (isNaN(timeNum)) { 
            event.target.select(); // selectされてない
            return;
        }
        setTime(function (hour: number, min: number): [number, number] {
            return [
                (hour > 23) ? hour % 10 : hour,
                (min > 23 && min % 10 > 6) ? min % 10 : min
            ]
        }(Math.floor(timeNum / 100) % 100, timeNum % 100));
    };

    const display = (): string => { return isActive ? HK0001Utils.formatDateToTime(date) : displayValue };
    return (
        <StyledInput
            size='small'
            inputProps={{
                ...inputProps,
                'type': 'tel',
                'value': display(),
                'onFocus': handleFocus,
                'onChange': handleChanged,
                'onBlur': handleBlur,
                'time': date,
            }}
            className={className}
        />
    );
};
export default AT0001TimeArea;