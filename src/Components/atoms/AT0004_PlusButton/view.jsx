import { StyledPlusBtn } from './style.js'

export const AT0004_PlusButton = (props) => {
  const { className, onClick } = props
  return (
    <StyledPlusBtn className={className} onClick={onClick} >
    </StyledPlusBtn>
  )
}