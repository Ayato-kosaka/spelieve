import React, { FC, useEffect, useState, useContext } from 'react';
import { doc, collection, getDoc, setDoc, addDoc, deleteDoc, DocumentSnapshot } from 'firebase/firestore';
// import db from '@/Itinerary/Endpoint/firestore';
import { ActivityIndicator, Text, Title } from 'react-native-paper';

import { PCT011MPlacesListProvider } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';
import { PMC01101GoogleMapPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList/ModelComponents/PMC01101GoogleMapPlaceList';
import { PMC01102PlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList/ModelComponents/PMC01102PlaceList';
import { PCO001SearchPlace } from '@/Place/Components/PCO001SearchPlace/SearchPlace';


export const PPA001Places = ({
    geopoint: Geopoint = new Geopoint(0,0), 
    maxDistance: number = 3000000,
}) => {
//   const [placesList, setPlacesList] = useState<DocumentSnapshot>();
  
  useEffect(() => {
    const fetch = async () => {
      
    };
    fetch();
  }, []);
  
  if(!placesList){
      return <ActivityIndicator animating={true} />
  }
  
  return(
    <PCT011MPlacesListProvider
        parentDocRef={placesList.ref}
        geopoint={geopoint}
        maxDistance={maxDistance}
    >
        <PMC01101GoogleMapPlacesList>
            <PMC01102PlacesList>

                <PMC01101GoogleMapPlacesList>

                </PMC01101GoogleMapPlacesList>
                <PCO001SearchPlace>

                </PCO001SearchPlace>
                <PMC01102PlacesList>

                </PMC01102PlacesList>

            </PMC01102PlacesList>
        </PMC01101GoogleMapPlacesList>
    </PCT011MPlacesListProvider>
  )
};
