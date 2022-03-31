import { Styled_input } from './style.js'

export const AT0002_TitleArea = (props) => {
  const { className, onFocusout } = props
  return (
    <Styled_input type="text" className={className} onBlur={onFocusout} ></Styled_input>
  )
}