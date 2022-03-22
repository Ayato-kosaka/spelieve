import { TitileInput } from './style.js'

export const AT0002_TitleArea = (props) => {
  const { onFocusout } = props
  return (
    <TitileInput type="text" onFocusout={onFocusout} ></TitileInput>
  )
}