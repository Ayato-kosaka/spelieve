import { Styled_div, Styled_MC0001_Plan } from './style.js'

export const OG0005_PlanGroup = (props) => {
  const { className } = props
  return (
    <Styled_div className={className}>
        <Styled_MC0001_Plan></Styled_MC0001_Plan>
    </Styled_div>
  )
}