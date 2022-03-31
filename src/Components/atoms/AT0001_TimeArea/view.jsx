import { Styled_input, Styled_p } from './style.js'

export const AT0001_TimeArea = (props) => {
  const { isInput = true, onFocusout, placeholder, className } = props;
  return (
    <>
      { isInput ? 
        <Styled_input type="tel" className={className} onBlur={onFocusout} placeholder={placeholder}></Styled_input> 
      : 
        <Styled_p className={className}></Styled_p> 
      }
    </>
  );
};