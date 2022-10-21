import { ActivityIndicator } from 'react-native-paper';
import { useState, createContext, useEffect } from 'react';
import db from '@/Endpoint/firestore'
import { collection, doc, query, QuerySnapshot, onSnapshot, addDoc, where, DocumentReference, DocumentSnapshot, QueryDocumentSnapshot, getDoc, getDocs, orderBy, Query } from 'firebase/firestore';
import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace';
import {
    MPlacesListInterface,
    MPlacesListValInterface,
    MPlacesListProviderPropsInterface,
} from 'spelieve-common/lib/Interfaces/Place';
import { PCT011MPlacesListConverter } from './MPlacesListConverter';
import { GeoPoint } from 'firebase/firestore';

export const PCT011MPlacesList = createContext({} as MPlacesListValInterface);

export const PCT011MPlacesListProvider = ({
    parentDocRef,
    children,
    initialCountry,
    initialAdministrativeAreaLevel1,
    initialAdministrativeAreaLevel2,
    initialLocality,
}: MPlacesListProviderPropsInterface) => {
    // temporary data
    const initialplacesList: Array<MPlacesListInterface> = [
        {
            place_id: "001",
            language: "ja",
            name: '横浜駅',
            imageUrl: './yokohama.jpeg',
            instagramAPIID: 'aaa',
            geometry: new GeoPoint(35.46606942124, 139.62261961841),
            geohash: 'aaa',
            mapUrl: 'aaa',
            website: undefined,
            address: 'aaa',
            phoneNumber: 'aaa',
            openingHours: [],
            rating: 1,
            popularTags: [],
            averageStayTime: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            place_id: "002",
            language: "ja",
            name: '東京駅',
            imageUrl: './tokyo_station.jpeg',
            instagramAPIID: 'aaa',
            geometry: new GeoPoint(35.6809591, 139.7673068),
            geohash: 'aaa',
            mapUrl: 'aaa',
            website: undefined,
            address: 'aaa',
            phoneNumber: 'aaa',
            openingHours: [],
            rating: 1,
            popularTags: [],
            averageStayTime: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];
    const [placesList, setPlacesList] = useState<MPlacesListInterface[]>(initialplacesList);
    const [country, setCountry] = useState<string>(initialCountry);
    const [administrativeAreaLevel1, setAdministrativeAreaLevel1] = useState<string>(initialAdministrativeAreaLevel1);
    const [administrativeAreaLevel2, setAdministrativeAreaLevel2] = useState<string>(initialAdministrativeAreaLevel2);
    const [locality, setLocality] = useState<string>(initialLocality);

    useEffect(() => {
        const fetchData = async () => {
            const placeCollectionRef = collection(db, MPlace.modelName).withConverter(PCT011MPlacesListConverter());
            const q = query(
                            placeCollectionRef,
                            where(MPlace.Cols.country, '==', country),
                            where(MPlace.Cols.administrativeAreaLevel1, '==', administrativeAreaLevel1),
                            where(MPlace.Cols.administrativeAreaLevel2, '==', administrativeAreaLevel2),
                            where(MPlace.Cols.locality, '==', locality),
                            orderBy('rating', 'desc')
                        );
            const querySnapshot = await getDocs(q);
            const places: MPlacesListInterface[] = [];
            querySnapshot.forEach(doc => {
                places.push(doc.data());
            });
            setPlacesList(places);
        }
        fetchData();
    }, [country, administrativeAreaLevel1, administrativeAreaLevel2, locality]);

    if (placesList.length == 0) {
        return <ActivityIndicator animating={true} />
    }

    const value: MPlacesListValInterface = {
        placesList,
        setCountry,
        setAdministrativeAreaLevel1,
        setAdministrativeAreaLevel2,
        setLocality,
    }
    return <PCT011MPlacesList.Provider value={value}>{children}</PCT011MPlacesList.Provider>
};
