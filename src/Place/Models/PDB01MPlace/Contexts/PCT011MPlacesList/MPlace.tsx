import { ActivityIndicator } from 'react-native-paper';
import { useState, createContext, useEffect, ReactNode } from 'react';
import db from '@/Place/Endpoint/firestore'
import { collection, doc, query, QuerySnapshot, onSnapshot, addDoc, DocumentReference, DocumentSnapshot, QueryDocumentSnapshot, GeoPoint } from 'firebase/firestore';
import { PDB01MPlaceCols, collectionName, PDB01MPlaceInterface } from '@/Place/Models/PDB01MPlace'
import { PCT011MPlacesListInterface } from './MPlacesListInterface';
import { PCT011MPlacesListConverter } from './MPlacesListConverter';
import { PCT011MPlacesListBuild } from './MPlacesListBuild';
import { PCT011MPlacesListValInterface } from './MPlacesListValInterface';
import { PCT011MPlacesListProviderPropsInterface } from './MPlacesListProviderPropsInterface';

export const PCT011MPlacesList = createContext({} as PCT011MPlacesListValInterface);

export const PCT011MPlacesListProvider = ({
    parentDocRef,
    children,
    geopoint,
    maxDistance,
}: PCT011MPlacesListProviderPropsInterface) => {
    
    const [geopointState, setGeopointState] = useState<GeoPoint>(geopoint || new GeoPoint(0, 0));
    const [maxDistanceState, setMaxDistanceState] = useState<number>(maxDistance || 30000);
    
    const collectionRef = parentDocRef
        ?   collection(parentDocRef, collectionName).withConverter(PCT011MPlacesListConverter())
        :   collection(db, collectionName).withConverter(PCT011MPlacesListConverter());

    const [placesList, setPlacesList] = useState<Array<PCT011MPlacesListInterface>>([]);

    useEffect(() => {
        // const fetchData = async () => {
        //     const unsubscribe = onSnapshot(
        //         query<PCT011MPlacesListInterface>(collectionRef),
        //         (querySnapshot) => {
        //             if(querySnapshot.empty){
        //                 create();
        //             } else {
        //                 setQuerySnapshot(querySnapshot);
        //             }
        //         }
        //     );
        // }
        // fetchData();
    }, [maxDistance]);

    if (!querySnapshot) {
        return <ActivityIndicator animating={true} />
    }
    
    const value: PCT011MPlacesListValInterface = {
        placesList,
        setGeopointState,
        setMaxDistanceState,
    }
    return <PCT011MPlacesList.Provider value={value}>{children}</PCT011MPlacesList.Provider>
};
