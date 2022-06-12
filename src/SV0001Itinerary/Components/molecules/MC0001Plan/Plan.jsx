import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import {
    StyledTimelineDot,
    StyledAT0001TimeArea,
    StyledAddPlanArea,
    StyledBodyArea,
    StyledGridContainer,
    StyledStartTimeArea,
    StyledTimelineDotArea,
    StyledSpanArea,
    StyledConnectorArea
}
from './style.js';
import useMC0001 from './PlanLogic';
import AT0006TimeP from 'SV0001Itinerary/Components/atoms/AT0006TimeP';

import OutlinedInput from '@material-ui/core/OutlinedInput';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

export const MC0001Plan = ({
    showSpan = true,
    showAddPlanProps = true,
    ...props
}) => {
    const { t } = useTranslation();
    const { isRepresentativePlan, plan, setPlan, updatePlan, deletePlan, insertPlan, openEditStartTimeDialog } = useMC0001(props);
    let index = props.index;
    let planGroupIndex = props.planGroupIndex;
    const [showAddPlan, setShowAddPlan] = useState(showAddPlanProps);
    
    useEffect(() => {
        setShowAddPlan(showAddPlanProps);
    }, [showAddPlanProps])

    const handleTitleChange = event => {
        const { name, value } = event.target;
        setPlan({ ...plan, [name]: value });
    }
    const handleBlur = event => {
        let { name, value } = event.target;
        if (event.target.getAttribute('time')) {
            value = new Date(1970, 0, 1, ...(event.target.getAttribute('time').split(',')));
        }
        updatePlan({ ...plan, [name]: value });
    }
    const handleStartTimeClick = () => {
        openEditStartTimeDialog();
    }

    const handleDeletePlanClick = () => {
        deletePlan(planGroupIndex, index);
    }

    const handleAddPlanClick = async () => {
        setShowAddPlan(false);
        await insertPlan(planGroupIndex, index + 1)
        setShowAddPlan(true);
    }


    return (
        <StyledGridContainer>
            <StyledStartTimeArea>
                <AT0006TimeP
                    value={ plan.startTime }
                    onClick={ handleStartTimeClick }
                    sx={ isRepresentativePlan ? { color: 'primary.main' } : {} }
                />
            </StyledStartTimeArea>

            <StyledTimelineDotArea>
                <StyledTimelineDot {...(isRepresentativePlan ? { 'color': 'primary' } : {})} />
            </StyledTimelineDotArea>

            <StyledBodyArea>
                <IconButton onClick={handleDeletePlanClick} tabIndex={-1} sx={{ px: 0 }} >
                    <CloseIcon />
                </IconButton>
                <OutlinedInput
                    size='small'
                    inputProps={{
                        'name': 'title',
                        'placeholder': t('カフェでひといき'),
                        'value': plan.title,
                        'onChange': handleTitleChange,
                        'onBlur': handleBlur
                    }}
                    sx={{flexGrow: 1}}
                    endAdornment={
                        <InputAdornment position='end' >
                            <DragIndicatorIcon
                                size='small'
                                style={{'cursor': 'default'}}
                            />
                        </InputAdornment>
                    }
                />
            </StyledBodyArea>

            <StyledSpanArea style={showSpan ? {} : {'display': 'none'}}>
                <StyledAT0001TimeArea
                    value={plan.span}
                    hourUnit='hr '
                    minUnit='min'
                    inputProps={{
                        'name': 'span',
                        'onBlur': handleBlur
                    }}
                />
            </StyledSpanArea>

            <StyledConnectorArea style={showSpan||showAddPlan ? {} : {'display': 'none'}}>
                <TimelineConnector />
            </StyledConnectorArea>

            <StyledAddPlanArea onClick={handleAddPlanClick} style={showAddPlan ? {} : {'display': 'none'}}>
                <Button
                    variant='outlined'
                    color='grey'
                    tabIndex={-1}
                    startIcon={<AddIcon />}
                >
                    {t('予定を追加')}
                </Button>
            </StyledAddPlanArea>
        </StyledGridContainer>
    )
}
export default MC0001Plan;