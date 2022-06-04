import { useTranslation } from 'react-i18next';
import { Draggable } from 'react-beautiful-dnd';
import {
    Styled_TimelineDot,
    Styled_AT0001TimeArea,
    Styled_AddPlanArea,
    Styled_BodyArea,
    Styled_GridContainer,
    Styled_StartTimeArea,
    Styled_TimelineDotArea,
    Styled_SpanArea,
    Styled_ConnectorArea
}
from './style.js';
import useMC0001 from './PlanLogic';

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
    showAddPlan = true,
    ...props
}) => {
    const { t } = useTranslation();
    const { isRepresentativePlan, plan, setPlan, updatePlan, updateRepresentiveStartTime, deletePlan, insertPlan, changeRepresentivePlanID } = useMC0001(props);
    let index = props.index;
    let planGroupIndex = props.planGroupIndex;

    const handleTitleChange = event => {
        const { name, value } = event.target;
        setPlan({ ...plan, [name]: value });
    }
    const handleBlur = event => {
        let { name, value } = event.target;
        if (event.target.getAttribute('time')) {
            value = new Date(1970, 1, 1, ...(event.target.getAttribute('time').split(',')));
        }
        updatePlan({ ...plan, [name]: value });
    }
    const handleRepresentiveStartTimeBlur = event => {
        let [hour, min] = event.target.getAttribute('time').split(',');
        updateRepresentiveStartTime(hour, min);
    }

    const handleDeletePlanClick = () => {
        deletePlan(planGroupIndex, index);
    }

    const handleAddPlanClick = () => {
        insertPlan(planGroupIndex, index + 1)
    }

    return (
        <Draggable draggableId={plan.id} index={index}>
            {(provided, snapshot) => (
                <Styled_GridContainer
                    ref={provided.innerRef}
                    snapshot={snapshot}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    tabIndex='-1'
                >
                    <Styled_StartTimeArea>
                        <Styled_AT0001TimeArea
                            isInput={ isRepresentativePlan }
                            value={ plan.startTime }
                            onPClick={ changeRepresentivePlanID }
                            inputProps={{
                                'name': 'representiveStartTime',
                                'onBlur': handleRepresentiveStartTimeBlur
                            }}
                        />
                    </Styled_StartTimeArea>

                    <Styled_TimelineDotArea>
                        <Styled_TimelineDot {...(isRepresentativePlan ? { 'color': 'primary' } : {})} />
                    </Styled_TimelineDotArea>

                    <Styled_BodyArea>
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
                    </Styled_BodyArea>

                    <Styled_SpanArea style={showSpan ? {} : {'display': 'none'}}>
                        <Styled_AT0001TimeArea
                            value={plan.span}
                            hourUnit='hr '
                            minUnit='min'
                            inputProps={{
                                'name': 'span',
                                'onBlur': handleBlur
                            }}
                        />
                    </Styled_SpanArea>

                    <Styled_ConnectorArea style={showSpan||showAddPlan ? {} : {'display': 'none'}}>
                        <TimelineConnector />
                    </Styled_ConnectorArea>

                    <Styled_AddPlanArea onClick={handleAddPlanClick} style={showAddPlan ? {} : {'display': 'none'}}>
                        <Button 
                            variant='outlined' 
                            color='grey'
                            tabIndex={-1} 
                            startIcon={<AddIcon />}
                        >
                            {t('予定を追加')}
                        </Button>
                    </Styled_AddPlanArea>



                </Styled_GridContainer>
            )
            }
        </Draggable>
    )
}
export default MC0001Plan;