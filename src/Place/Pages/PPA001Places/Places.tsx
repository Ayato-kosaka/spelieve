import React, { FC, useEffect, useState, useContext } from 'react';
import { doc, collection, getDoc, setDoc, addDoc, deleteDoc, DocumentSnapshot } from 'firebase/firestore';
// import db from '@/Itinerary/Endpoint/firestore';
import { ActivityIndicator, Text, Title } from 'react-native-paper';

import { PCT011MPlacesListProvider, PCT011MPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';
import { PPA001PlacesPropsInterface } from 'spelieve-common/lib/Interface';
import { PMC01101GoogleMapPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList/ModelComponents/PMC01101GoogleMapPlacesList';
import { PCO001SearchPlace } from '@/Place/Components/PCO001SearchPlace/SearchPlace';
import { PMC01102PlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList/ModelComponents/PMC01102PlacesList';
import { PPA001PlacesController } from './PlacesController';

export const PPA001Places = ({
  geopoint,
  maxDistance,
  navigation
}: PPA001PlacesPropsInterface) => {
  
  const { onAutoCompleteClicked, onPlaceSelected } = PPA001PlacesController();
  // if(!placesList){
  //     return <ActivityIndicator animating={true} />
  // }

  return (
    <PCT011MPlacesListProvider
      parentDocRef={undefined}
      initialCountry={"日本"}
      initialAdministrativeAreaLevel1={"東京都"}
      initialAdministrativeAreaLevel2={""}
      initialLocality={"渋谷区"}
    >
      <PMC01101GoogleMapPlacesList />
      <PCO001SearchPlace
        onAutoCompleteClicked={onAutoCompleteClicked}
      />
      <PMC01102PlacesList />
    </PCT011MPlacesListProvider>
  )
};
