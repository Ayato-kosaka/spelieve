import { PlusBtn } from './style.js'

export const AT0004_PlusButton = (props) => {
  const { onClick } = props
  return (
    <PlusBtn onClick={onClick} >
      +
    </PlusBtn>
  )
}