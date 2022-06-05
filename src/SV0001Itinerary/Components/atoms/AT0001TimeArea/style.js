import styled from 'styled-components'
import Input from '@material-ui/core/Input';

export const Styled_input = styled(Input)`
    width: 55px;
    cursor: default;
    & > input {
        pointer-events: none;
        caret-color: #ff000000;
    }
`