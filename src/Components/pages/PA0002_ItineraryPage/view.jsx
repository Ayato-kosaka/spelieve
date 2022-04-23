import { useTranslation } from "react-i18next";
import React, { Component, useEffect, useState, createContext } from "react";
import HK0001_useItinerary from 'Hooks/HK0001_useItinerary'
import { Styled_div } from './style.js'
import TextField from '@material-ui/core/TextField';


import { AT0001_TimeArea } from 'Components/atoms/AT0001_TimeArea/view';
import { AT0002_TitleArea } from 'Components/atoms/AT0002_TitleArea/view';
import { MC0001_Plan } from 'Components/molecules/MC0001_Plan/view';
import MC0003_AppBar from 'Components/molecules/MC0003_AppBar/view';
import { OG0001_PlanGroupList } from 'Components/organisms/OG0001_PlanGroupList/view';
import { OG0005_PlanGroup } from 'Components/organisms/OG0005_PlanGroup/view';

import { CT0001_PlanGroupsProvider } from 'Components/context/CT0001_PlanGroups.jsx'
import { CT0002_PlansProvider } from 'Components/context/CT0002_Plans.jsx'

import { BL0014_insertItineraryTestData, BL0010_getItinerary, HK0001_Itinerary } from 'Hooks/HK0001_useItinerary'


export const PA0002_ItineraryPage = () => {
    const { t } = useTranslation();
    const [itinerary, setItinerary] = useState({});
    useEffect(async () => {
        let id = 'XOUO4iYYouEd7YoGPBaw';
        let  x = await BL0014_insertItineraryTestData();
        id = x.id
        setItinerary(await new HK0001_useItinerary().build(id));
    }, []);


    const handleChange = event => {
        const { name, value } = event.target;
        let itineraryCopy = itinerary.copy();
        itineraryCopy.setBody({[name]: value });
        setItinerary(itineraryCopy);
    }

    const handleBlur = () => {
        itinerary.update();
    }

    return (
        <Styled_div>
            <MC0003_AppBar />
            <TextField
                id="outlined-basic"
                fullWidth
                label={t("タイトル")}
                variant="outlined"
                inputProps={{
                    "name": "title",
                    "value": itinerary.title || "",
                    "onChange": handleChange,
                    onBlur: handleBlur
                }}
                sx={{ my: 2 }}
            />
            <CT0002_PlansProvider>
                <CT0001_PlanGroupsProvider>
                    {itinerary.id && <OG0001_PlanGroupList itinerayId={itinerary.id} />}
                </CT0001_PlanGroupsProvider>
            </CT0002_PlansProvider>
        </Styled_div>
    )
}