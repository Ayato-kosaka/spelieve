import { StyledTimeInput, StyledTimeOutput } from './style.js'

export const AT0001_TimeArea = (props) => {
  const { isInput = true, onFocusout } = props;
  return (
    <>
      { isInput ? <StyledTimeInput type="time" onBlur={onFocusout}></StyledTimeInput> : <StyledTimeOutput></StyledTimeOutput> }
    </>
  );
};