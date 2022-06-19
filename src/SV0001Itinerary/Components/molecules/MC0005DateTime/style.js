import styled from 'styled-components';

import AT0001TimeArea from 'SV0001Itinerary/Components/atoms/AT0001TimeArea';

import TextField from '@material-ui/core/TextField';

export const StyledTextField = styled(TextField)`
    width: 60px;
`

export const StyledAT0001TimeArea = styled(AT0001TimeArea)`
    vertical-align: top;
    margin-left: 20px;
    margin-top: 8px;
    margin-bottom: 4px;
    & input {
        padding: 4px 0 5px;
    }
`