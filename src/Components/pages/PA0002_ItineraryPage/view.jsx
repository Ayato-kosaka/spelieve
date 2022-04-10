import { useTranslation } from "react-i18next";
import React, { Component, useEffect, useState, createContext } from "react";
import { Styled_div, Styled_Fab } from './style.js'

import AddIcon from '@material-ui/icons/Add';

import { AT0001_TimeArea } from 'Components/atoms/AT0001_TimeArea/view';
import { AT0002_TitleArea } from 'Components/atoms/AT0002_TitleArea/view';
import { AT0004_PlusButton } from 'Components/atoms/AT0004_PlusButton/view';
import { MC0001_Plan } from 'Components/molecules/MC0001_Plan/view';
import { OG0001_PlanGroupList } from 'Components/organisms/OG0001_PlanGroupList/view';
import { OG0005_PlanGroup } from 'Components/organisms/OG0005_PlanGroup/view';

import{ BL0014_insertItineraryTestData, BL0010_getItinerary, HK0001_Itinerary } from 'Hooks/HK0001_useItinerary'


export const ItineraryContext = createContext("");

export const PA0002_ItineraryPage = () => {
    const { t } = useTranslation();
	const [itinerary, setItinerary] = useState(new HK0001_Itinerary());
    useEffect(async () => {
        // setItinerary(await BL0014_insertItineraryTestData());
        setItinerary(await new HK0001_Itinerary().build('OLERRQe58wV4sfrdv8Ez'));
    }, []);
    return (
        <ItineraryContext.provider
            value={{itinerary}}
        >
            <Styled_Fab color="primary" aria-label="add">
                <AddIcon />
            </Styled_Fab>
            {/* <h1>AT0001_TimeArea</h1>
            <AT0001_TimeArea></AT0001_TimeArea>
            <h1>AT0002_TitleArea</h1>
            <AT0002_TitleArea></AT0002_TitleArea> */}
            {/* <h1>MC0001_Plan</h1>
            <MC0001_Plan></MC0001_Plan> */}
            {/* <h1>OG0005_PlanGroup</h1>
            <OG0005_PlanGroup></OG0005_PlanGroup> */}
            {console.log(itinerary)}
            <h1>{itinerary.title}</h1>
            <OG0001_PlanGroupList></OG0001_PlanGroupList>
        </ItineraryContext.provider>
  )
}