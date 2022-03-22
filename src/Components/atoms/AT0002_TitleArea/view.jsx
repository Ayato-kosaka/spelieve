import { TitleInput } from './style.js'

export const AT0002_TitleArea = (props) => {
  const { onFocusout } = props
  return (
    <TitleInput type="text" onBlur={onFocusout} ></TitleInput>
  )
}