import { TimeInput, TimeOutput } from './style.js'

export const TimeArea = (props) => {
  const { isInput } = props;
  return (
    <>
      { isInput ? <TimeInput type="time"></TimeInput> : <TimeOutput></TimeOutput> }
    </>
  );
};