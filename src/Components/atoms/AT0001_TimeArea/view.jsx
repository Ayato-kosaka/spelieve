import { Styled_input, Styled_p } from './style.js'
import React, { useEffect, useState } from "react";

export const AT0001_TimeArea = (props) => {
  const { isInput = true, onFocusout, className, defaultValue } = props;
  const [time, setTime] = useState('00:00');
  const handleFocus = (event) => event.target.select();
  const handleChanged = event => {
    let val = parseInt(event.target.value.split(':').join(''));
    let min = val%100;
    let hour = Math.floor( val/100 )%100;
    if(min>23 && min%10>6){
        min%=10;
    }
    if(hour>23){
        hour%=10;
    }
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
            onBlur={onFocusout}
            defaultValue={defaultValue}
        /> 
      : 
        <Styled_p className={className}>{time}</Styled_p> 
      }
    </>
  );
};