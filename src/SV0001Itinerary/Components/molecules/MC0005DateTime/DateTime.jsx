import { useTranslation } from 'react-i18next'
import { useState } from 'react';
import {
    StyledAT0001TimeArea,
    StyledTextField,
}
from './style.js';

import InputAdornment from '@material-ui/core/InputAdornment';

export const MC0005DateTime = ({
    setFormData,
    initialDate,
    skipDateFocus = false
}) => {
    const { t } = useTranslation();
    const [date, setDate] = useState(initialDate);
    const [dateNum, setDateNum] = useState(initialDate.getDate());

    const handleDateChange = event => {
        const { name, value } = event.target;
        let newDate = new Date(initialDate)
        newDate.setDate(value);
        newDate.setHours(date.getHours());
        newDate.setMinutes(date.getMinutes());
        setFormData({ 'date': newDate });
        setDateNum(value);
        setDate(newDate);
    }
    const handleTimeBlur = event => {
        let [hour, min] = event.target.getAttribute('time').split(',');
        let newDate = new Date(date.getTime())
        newDate.setHours(hour);
        newDate.setMinutes(min);
        setFormData({ 'date': newDate });
        setDate(newDate);
    }

    const handleFocus = (event) => event.target.select();

    return (
        <>
            <StyledTextField
                autoFocus={ !skipDateFocus }
                margin='dense'
                variant='standard'
                type='tel'
                value={ dateNum }
                onFocus={ handleFocus }
                onChange={ handleDateChange }
                InputProps={{
                    startAdornment: <InputAdornment position="start">Day</InputAdornment>,
                }}
            />
            <StyledAT0001TimeArea
                value={ initialDate }
                inputProps={{
                    'onBlur': handleTimeBlur,
                    'autoFocus': skipDateFocus
                }}
            />
        </>
    )
}
export default MC0005DateTime;