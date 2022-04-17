import { useTranslation } from "react-i18next";
import React, { Component, useEffect, useState, createContext } from "react";
import HK0001_useItinerary from 'Hooks/HK0001_useItinerary'
import { Styled_div } from './style.js'


import { AT0001_TimeArea } from 'Components/atoms/AT0001_TimeArea/view';
import { AT0002_TitleArea } from 'Components/atoms/AT0002_TitleArea/view';
import { MC0001_Plan } from 'Components/molecules/MC0001_Plan/view';
import { OG0001_PlanGroupList } from 'Components/organisms/OG0001_PlanGroupList/view';
import { OG0005_PlanGroup } from 'Components/organisms/OG0005_PlanGroup/view';

import{ BL0014_insertItineraryTestData, BL0010_getItinerary, HK0001_Itinerary } from 'Hooks/HK0001_useItinerary'


export const PA0002_ItineraryPage = () => {
    const { t } = useTranslation();
	const [itinerary, setItinerary] = useState({});
    useEffect(async () => {
        // let  x = await BL0014_insertItineraryTestData();
        // setItinerary(await new HK0001_useItinerary().build(x.id));
        let id = 'F3qXUYdOhgkpkFewJUxe';
        setItinerary(await new HK0001_useItinerary().build(id));
    }, []);
    // const handleButtonClick = () => {
    //     let itineraryCopy = itinerary.copy();
    //     itineraryCopy.setData({"title": "hello"});
    //     setItinerary(itineraryCopy);
    // }

    return (
        <Styled_div>
            <h1>{itinerary.title}</h1>
            {itinerary.id && <OG0001_PlanGroupList itinerayId={itinerary.id} />}
        </Styled_div>
  )
}