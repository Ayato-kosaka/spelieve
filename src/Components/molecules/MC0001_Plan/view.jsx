import { PlanInput } from './style'
import { TimeArea } from 'Components/atoms/AT0001_TimeArea/view'
import { TitleArea } from 'Components/atoms/AT0002_TitleArea/view'
import { SpanArea } from 'Components/atoms/AT0003_SpanArea/view'

export const Plan = () => {
  
  return (
    <PlanInput>
      <TimeArea></TimeArea>
      <TitleArea></TitleArea>
      <SpanArea></SpanArea>
    </PlanInput>
  )
}