import { StyledInput } from './style.js'
import { useEffect, useState } from 'react';
import * as HK0001Utils from 'SV0000Common/Hooks/HK0001Utils'


export const AT0001TimeArea = ({
    inputProps,
    displayValue,
    ...props
}) => {
    displayValue ||= HK0001Utils.formatDateToTime(props.value);
    
    const [time, setTime] = useState([0,0]); //[hour, min]
    useEffect(() => {
        if(props.value){ setTime([props.value.getHours(), props.value.getMinutes()]); }
    }, [props.value]);
    const date = new Date(1970, 0, 1, ...time);
    
    const [isActive, setIsActive] = useState(false);
    const [target, setTarget] = useState();
    const handleFocus = (event) => {
        setIsActive(true);
        setTarget(event.target);
    };
    // Focus in 後のレンダリングで、表示文字が変更されるため、handleFocus 内でなく、useEffect 内で target.select() する
    useEffect(() => {
        if (isActive) {
            target.select();
        }
    }, [isActive]);
    
    const handleBlur = (event) => {
        setIsActive(false);
        inputProps.onBlur(event);
    }
    
    const handleChanged = event => {
        const value = event.target.value;
        const timeNum = (() => {
            if (value.length==0) {
                return 0;
            }else if (value === display().substr(0,display().length-1)){ // BackSpace が入力された場合
                return Math.floor(parseInt(time.join(''))/10)
            } else {
                const downedKey = parseInt(value[value.length - 1]);
                if(isNaN(downedKey)){  // 数値以外が入力された場合
                    return NaN;
                } else if (value.length==1){ // 入力済みの値を削除し数値が入力された場合
                    return downedKey;
                } else { // 数値が追加入力された場合
                    return (parseInt(time.join(''))*10 + downedKey) % 10000;
                }
            }
        })();
        if(isNaN(timeNum)){
            event.target.select();
            return;
        }
        setTime(function(hour, min){
            return [
                (hour > 23) ? hour % 10 : hour,
                (min > 23 && min % 10 > 6) ? min % 10 : min
            ]
        }(Math.floor(timeNum / 100) % 100, timeNum % 100));
    };
    
    const display = () => { return isActive ? HK0001Utils.formatDateToTime(date) : displayValue };
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
            className={props.className}
        />
    );
};
export default AT0001TimeArea;