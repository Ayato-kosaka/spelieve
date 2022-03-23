import { StyledPlusBtn } from './style.js'

export const AT0004_PlusButton = (props) => {
  const { onClick } = props
  return (
    <StyledPlusBtn onClick={onClick} >
      +
    </StyledPlusBtn>
  )
}