import { PlusBtn } from './style.js'

export const PlusButton = (props) => {
  const { onClick } = props;
  return (
    <PlusBtn onClick={onClick} >
      +
    </PlusBtn>
  )
}