import { StyledInput, StyledOutput } from './style.js'

export const AT0001_TimeArea = (props) => {
  const { isInput = true, onFocusout } = props;
  return (
    <>
      {isInput ? <StyledInput type="time" onFocusout={onFocusout}></StyledInput> : <StyledOutput></StyledOutput>}
    </>
  );
};