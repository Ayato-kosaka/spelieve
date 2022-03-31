import { Styled_div, Styled_AT0001_TimeArea, Styled_AT0002_TitleArea } from './style.js'

export const MC0001_Plan = (props) => {
  const { className } = props
  return (
    <Styled_div className={className}>
      <Styled_AT0001_TimeArea></Styled_AT0001_TimeArea>
      <Styled_AT0002_TitleArea></Styled_AT0002_TitleArea>
      <Styled_AT0001_TimeArea></Styled_AT0001_TimeArea>
    </Styled_div>
  )
}