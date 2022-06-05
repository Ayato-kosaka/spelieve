import { useTranslation } from 'react-i18next'
import { useState } from 'react';
import {
    StyledAT0001TimeArea,
    StyledTextField,
}
from './style.js';

import InputAdornment from '@material-ui/core/InputAdornment';

export const MC0005DateTime = ({
    setFormData
}) => {
    const { t } = useTranslation();
    const [date, setDate] = useState(1);
    const [hour, setHour] = useState(0);
    const [min, setMin] = useState(0);

    const handleDateChange = event => {
        const { name, value } = event.target;
        setFormData({'date': value, hour, min});
        setDate(value);
    }
    const handleTimeBlur = event => {
        let [hour, min] = event.target.getAttribute('time').split(',');
        setFormData({date, hour, min});
        setHour(hour);
        setMin(min);
    }

    const handleFocus = (event) => event.target.select();

    return (
        <>
            <StyledTextField
                autoFocus
                margin='dense'
                variant='standard'
                type='tel'
                value={ date }
                onFocus={ handleFocus }
                onChange={ handleDateChange }
                InputProps={{
                    startAdornment: <InputAdornment position="start">Day</InputAdornment>,
                }}
            />
            <StyledAT0001TimeArea
                inputProps={{
                    'onBlur': handleTimeBlur
                }}
            />
        </>
    )
}
export default MC0005DateTime;