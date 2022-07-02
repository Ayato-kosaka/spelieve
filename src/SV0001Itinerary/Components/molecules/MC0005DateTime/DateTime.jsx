import { useTranslation } from 'react-i18next'
import { useState } from 'react';
import {
    StyledTextField,
    StyledAT0001TimeArea,
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
        const { value } = event.target;
        let newDate = new Date(initialDate)
        newDate.setDate(value);
        newDate.setHours(date.getHours());
        newDate.setMinutes(date.getMinutes());
        setFormData({ 'date': newDate });
        setDateNum(value);
        setDate(newDate);
    }
    const handleTimeBlur = event => {
        let [hour, min] = function(d){ return[d.getHours(), d.getMinutes()] }(new Date(event.target.getAttribute('time')));
        let newDate = new Date(date.getTime());
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
                    startAdornment: <InputAdornment position="start">{t('Day')}</InputAdornment>,
                }}
            />
            <StyledAT0001TimeArea
                dateTime={ initialDate }
                inputProps={{
                    onBlur: handleTimeBlur,
                    autoFocus: skipDateFocus
                }}
            />
        </>
    )
}
export default MC0005DateTime;