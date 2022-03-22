import { TimeInput, TimeOutput } from './style.js'

export const AT0001_TimeArea = (props) => {
  const { isInput, onFocusout } = props;
  return (
    <>
      { isInput ? <TimeInput type="time" onFocusout={onFocusout}></TimeInput> : <TimeOutput></TimeOutput> }
    </>
  );
};