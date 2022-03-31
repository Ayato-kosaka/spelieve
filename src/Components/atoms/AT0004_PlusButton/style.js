import styled from 'styled-components'


const StyledPlusBtn_width = 50;
const StyledPlusBtn_before_width = StyledPlusBtn_width*0.55;
const StyledPlusBtn_borderWidth = StyledPlusBtn_width/8;
export const StyledPlusBtn = styled.button`
  position: relative;
  background: white;
  width: ${StyledPlusBtn_width}px;
  height: ${StyledPlusBtn_width}px;
  border: ${StyledPlusBtn_borderWidth}px solid black;
  border-radius: 50%;

  &:before, &:after{
    content: '';
    position: absolute;
    display: inline-block;
    width: ${StyledPlusBtn_before_width}px;
    top: calc(50% - ${StyledPlusBtn_borderWidth/2}px);
    left: 50%;
    border-top: ${StyledPlusBtn_borderWidth}px solid black;
  }
  &:before{
    transform: translateX(-50%);
  }
  &:after{
    transform: translateX(-50%) rotate(-90deg);
  }
`