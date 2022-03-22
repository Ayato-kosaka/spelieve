import { styled_input, styled_p } from './style.js'

export const AT0001_TimeArea = (props) => {
  const { isInput=true, onFocusout } = props;
  return (
    <>
      { isInput ? <styled_input type="time" onFocusout={onFocusout}></styled_input> : <styled_p></styled_p> }
    </>
  );
};