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
    
    const [querySnapshot, setQuerySnapshot] = useState<PCT011MPlacesListValInterface['querySnapshot'] | null>(null);
    
    const collectionRef = parentDocRef
        ?   collection(parentDocRef, collectionName).withConverter(PCT011MPlacesListConverter())
        :   collection(db, collectionName).withConverter(PCT011MPlacesListConverter());

    const [placesList, setPlacesList] = useState<Array<PCT011MPlacesListInterface>>([]);

    useEffect(() => {
        const fetchData = async () => {
            const unsubscribe = onSnapshot(
                query<PCT011MPlacesListInterface>(collectionRef),
                (querySnapshot) => {
                    if(querySnapshot.empty){
                        create();
                    } else {
                        setQuerySnapshot(querySnapshot);
                    }
                }
            );
        }
        fetchData();
    }, [parentDocRef]);

    const create: PCT011MPlacesListValInterface['create'] = async () => {
        return await addDoc<PCT011MPlacesListInterface>(collectionRef, PCT011MPlacesListBuild());
    }

    if (!querySnapshot) {
        return <ActivityIndicator animating={true} />
    }

    const setGeopoint = (geopoint: GeoPoint) => {

    }

    const setMaxDistance = (maxDistance: number) => {

    }
    
    const value: PCT011MPlacesListValInterface = {
        querySnapshot,
        create,
        placesList,
        setGeopoint,
        setMaxDistance,
    }
    return <PCT011MPlacesList.Provider value={value}>{children}</PCT011MPlacesList.Provider>
};
