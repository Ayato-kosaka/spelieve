import { Styled_input, Styled_p } from './style.js'
import React, { useEffect, useState } from "react";

const dateToString = (date) => {
    if(!date || date.constructor.name!=='Date' ){
        return('00:00');
    }else{
        return(String(date.getHours()).padStart(2,'0') + ":" + String(date.getMinutes()).padStart(2,'0'));
    }
}

export const AT0001_TimeArea = (props) => {
  const { isInput = true, onFocusout, className, value } = props;
  const [time, setTime] = useState('00:00');
  useEffect( () => {
    setTime(dateToString(value));
  }, [props.value]);
  const handleFocus = (event) => event.target.select();
  const handleBlur = (event) => {
    let date = value;
    let [hour,min] = event.target.value.split(':').map((v)=>(parseInt(v)));
    date.setHours(hour);
    date.setMinutes(min);
    console.log(date)
  }
  const handleChanged = event => {
    let val = parseInt(event.target.value.split(':').join(''));
    let min = val%100;
    let hour = Math.floor( val/100 )%100;
    if(min>23 && min%10>6){ min%=10; }
    if(isNaN(min)){ min=0 }
    if(hour>23){ hour%=10; }
    if(isNaN(hour)){ hour=0 }
    setTime(String(hour).padStart(2,'0') + ':' + String(min).padStart(2,'0'));
  };
  return (
    <>
      { isInput ? 
        <Styled_input
            size="small"
            inputProps={{
                "type": "tel",
                "value": time,
                "onFocus": handleFocus,
                "onChange": handleChanged
            }}
            className={className}
            onBlur={handleBlur}
        /> 
      : 
        <Styled_p className={className}>{time}</Styled_p> 
      }
    </>
  );
};