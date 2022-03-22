import { TimeInput, TimeOutput } from './style.js'

export const AT0001_TimeArea = (props) => {
  const { isInput } = props;
  return (
    <>
      { isInput ? <TimeInput type="time"></TimeInput> : <TimeOutput></TimeOutput> }
    </>
  );
};