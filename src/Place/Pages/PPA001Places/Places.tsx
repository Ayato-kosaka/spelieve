import React, { FC, useEffect, useState, useContext } from 'react';
import { doc, collection, getDoc, setDoc, addDoc, deleteDoc, DocumentSnapshot } from 'firebase/firestore';
// import db from '@/Itinerary/Endpoint/firestore';
import { ActivityIndicator, Text, Title } from 'react-native-paper';

import { PlacesPropsInterface } from 'spelieve-common/lib/Interfaces';
import { PCT011MPlacesListProvider, PCT011MPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';
import { PMC01101GoogleMapPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList/ModelComponents/PMC01101GoogleMapPlacesList';
import { PCO001SearchPlace } from '@/Place/Components/PCO001SearchPlace/SearchPlace';
import { PMC01102PlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList/ModelComponents/PMC01102PlacesList';
import { PPA001PlacesController } from './PlacesController';

function InnerComponent() {
  const { onAutoCompleteClicked, onPlaceSelected } = PPA001PlacesController();

  // const { placesList } = useContext(PCT011MPlacesList);
  

  return (
    <>
        <PMC01101GoogleMapPlacesList />
        <PCO001SearchPlace
          onAutoCompleteClicked={onAutoCompleteClicked}
        />
        <PMC01102PlacesList />
    </>
  )
}

export function PPA001Places({
    country,
    administrativeAreaLevel1, 
    administrativeAreaLevel2,
    locality, 
    navigation,
}: PlacesPropsInterface) {
  
  return (
    <PCT011MPlacesListProvider
        parentDocRef={undefined}
        initialCountry={country}
        initialAdministrativeAreaLevel1={administrativeAreaLevel1 || ""}
        initialAdministrativeAreaLevel2={administrativeAreaLevel2 || ""}
        initialLocality={locality || ""}
    >
      <InnerComponent />
    </PCT011MPlacesListProvider>
  )
}
