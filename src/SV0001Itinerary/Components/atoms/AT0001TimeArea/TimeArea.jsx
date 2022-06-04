import { useTranslation } from 'react-i18next';
import { Styled_input, Styled_p } from './style.js'
import { useEffect, useState } from 'react';


export const AT0001TimeArea = ({
    isInput = true,
    onFocusout,
    className,
    inputProps,
    hourUnit = ':',
    minUnit = '',
    onPClick,
    ...props
}) => {
    const { t } = useTranslation();
    const [time, setTime] = useState([0,0]); //[hour, min]
    useEffect(() => {
        if(props.value){ setTime([props.value.getHours(), props.value.getMinutes()]); }
    }, [props.value]);
    const handleFocus = (event) => event.target.select();
    const handleChanged = event => {
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
    const handleKeyDown = (event) => {
        if(isNaN(event.key)){
            event.target.select();
            return;
        }
    }
    
    const handlePClick = () => {
        if(window.confirm(t('代表の予定を変更しますか？'))){
            onPClick();
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
            {isInput ?
                <Styled_input
                    size='small'
                    inputProps={{
                        ...inputProps,
                        'type': 'tel',
                        'value': display(),
                        'onFocus': handleFocus,
                        'onChange': handleChanged,
                        'onKeyDown': handleKeyDown,
                        'time': time
                    }}
                    className={className}
                />
                :
                <Styled_p 
                    className={className}
                    onClick={handlePClick}
                >
                    {display()}
                </Styled_p>
            }
        </>
    );
};
export default AT0001TimeArea;