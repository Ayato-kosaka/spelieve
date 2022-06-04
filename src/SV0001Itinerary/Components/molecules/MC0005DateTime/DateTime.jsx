import { useTranslation } from 'react-i18next'
import {
    Styled_AT0001TimeArea,
    Styled_TextField,
}
from './style.js';

import InputAdornment from '@material-ui/core/InputAdornment';

export const MC0005DateTime = ({
    ...props
}) => {
    const { t } = useTranslation();

    return (
        <>
            <Styled_TextField
                autoFocus
                margin='dense'
                id='name'
                variant='standard'
                type='tel'
                InputProps={{
                    startAdornment: <InputAdornment position="start">Day</InputAdornment>,
                }}
            />
            <Styled_AT0001TimeArea />
        </>
    )
}
export default MC0005DateTime;