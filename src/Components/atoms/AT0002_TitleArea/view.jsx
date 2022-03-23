import { StyledTitleInput } from './style.js'

export const AT0002_TitleArea = (props) => {
  const { onFocusout } = props
  return (
    <StyledTitleInput type="text" onBlur={onFocusout} ></StyledTitleInput>
  )
}