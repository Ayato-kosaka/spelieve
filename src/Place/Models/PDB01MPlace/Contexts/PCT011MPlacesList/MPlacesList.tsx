import { ActivityIndicator } from 'react-native-paper';
import { useState, createContext, useEffect } from 'react';
import { collection, doc, query, QuerySnapshot, onSnapshot, addDoc, where, DocumentReference, DocumentData, DocumentSnapshot, QueryDocumentSnapshot, getDoc, getDocs, orderBy, Query } from 'firebase/firestore';
import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace';
import {
    MPlacesListInterface,
    MPlacesListValInterface,
    MPlacesListProviderPropsInterface,
} from 'spelieve-common/lib/Interfaces/Place';
import { PCT011MPlacesListConverter } from './MPlacesListConverter';
import db from '@/Place/Endpoint/firestore'

export const PCT011MPlacesList = createContext({} as MPlacesListValInterface);

export function PCT011MPlacesListProvider({
    parentDocRef,
    children,
    initialCountry,
    initialAdministrativeAreaLevel1,
    initialAdministrativeAreaLevel2,
    initialLocality,
}: MPlacesListProviderPropsInterface) {
    // temporary data
    // const initialplacesList: Array<MPlacesListInterface> = [
    //     {
    //         place_id: "001",
    //         language: "ja",
    //         name: '横浜駅',
    //         // imageUrl: '',
    //         photoUrls: [''],
    //         instagramAPIID: 'aaa',
    //         geometry: new GeoPoint(35.46606942124, 139.62261961841),
    //         geohash: 'aaa',
    //         mapUrl: 'aaa',
    //         website: undefined,
    //         address: 'aaa',
    //         phoneNumber: 'aaa',
    //         openingHours: [],
    //         rating: 1,
    //         popularTags: [],
    //         averageStayTime: new Date(),
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //     },
    //     {
    //         place_id: "002",
    //         language: "ja",
    //         name: '東京駅',
    //         photoUrls: [''],
    //         // instagramAPIID: 'aaa',
    //         geometry: new GeoPoint(35.6809591, 139.7673068),
    //         // geohash: 'aaa',
    //         mapUrl: 'aaa',
    //         website: undefined,
    //         address: 'aaa',
    //         phoneNumber: 'aaa',
    //         openingHours: [],
    //         rating: 1,
    //         popularTags: [],
    //         averageStayTime: new Date(),
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //     },
    // ];

    const initialAddress = {
        country: initialCountry,
        administrativeAreaLevel1: initialAdministrativeAreaLevel1,
        administrativeAreaLevel2: initialAdministrativeAreaLevel2,
        locality: initialLocality,
    }
    const [placesList, setPlacesList] = useState<MPlacesListInterface[]>([]);
    const [searchedAddress, setSearchedAddress] = useState(initialAddress);
    console.log(placesList);
    console.log(searchedAddress);
    // const [country, setCountry] = useState<MPlacesListProviderPropsInterface['initialCountry']>(initialCountry);
    // const [administrativeAreaLevel1, setAdministrativeAreaLevel1] = useState<MPlacesListProviderPropsInterface['initialAdministrativeAreaLevel1']>(initialAdministrativeAreaLevel1);
    // const [administrativeAreaLevel2, setAdministrativeAreaLevel2] = useState<MPlacesListProviderPropsInterface['initialAdministrativeAreaLevel2']>(initialAdministrativeAreaLevel2);
    // const [locality, setLocality] = useState<MPlacesListProviderPropsInterface['initialLocality']>(initialLocality);

    useEffect(()=> {
        const createPlaceQuery = (): Query => {
            // const collectionRef = parentDocRef
            //         ? collection(parentDocRef, MPlace.modelName).withConverter(PCT011MPlacesListConverter())
            //         : collection(db, MPlace.modelName).withConverter(PCT011MPlacesListConverter());
            const placeCollectionRef = collection(db, MPlace.modelName); // .withConverter(PCT011MPlacesListConverter());
            let q: Query = query(
                                placeCollectionRef,
                                where(MPlace.Cols.country, '==', searchedAddress.country),
                                orderBy('rating', 'desc')
                            );
            if (searchedAddress.administrativeAreaLevel1 !== ''){
                q = query(
                        placeCollectionRef,
                        where(MPlace.Cols.country, '==', searchedAddress.country),
                        where(MPlace.Cols.administrativeAreaLevel1, '==', searchedAddress.administrativeAreaLevel1),
                        orderBy('rating', 'desc')
                    );
            }

            if (searchedAddress.administrativeAreaLevel2 !== ''){
                q = query(
                        placeCollectionRef,
                        where(MPlace.Cols.country, '==', searchedAddress.country),
                        where(MPlace.Cols.administrativeAreaLevel1, '==', searchedAddress.administrativeAreaLevel1),
                        where(MPlace.Cols.administrativeAreaLevel2, '==', searchedAddress.administrativeAreaLevel2),
                        orderBy('rating', 'desc')
                    );
            }

            if (searchedAddress.administrativeAreaLevel2 !== '' && searchedAddress.locality !== '') { // index済
                q = query(
                        placeCollectionRef,
                        where(MPlace.Cols.country, '==', searchedAddress.country),
                        where(MPlace.Cols.administrativeAreaLevel1, '==', searchedAddress.administrativeAreaLevel1),
                        where(MPlace.Cols.administrativeAreaLevel2, '==', searchedAddress.administrativeAreaLevel2),
                        where(MPlace.Cols.locality, '==', searchedAddress.locality),
                        orderBy('rating', 'desc')
                    );
            }

            if (searchedAddress.administrativeAreaLevel2 === '' && searchedAddress.locality !== '') { // index済
                q = query(
                    placeCollectionRef,
                    where(MPlace.Cols.country, '==', searchedAddress.country),
                    where(MPlace.Cols.administrativeAreaLevel1, '==', searchedAddress.administrativeAreaLevel1),
                    where(MPlace.Cols.locality, '==', searchedAddress.locality),
                    orderBy('rating', 'desc')
                );
            }
            return q;
        }

        const fetchUpData = async (q: Query) => {
            const querySnapshot = await getDocs(q);
            const places: MPlacesListInterface[] = [];
            querySnapshot.forEach(doc => {
                places.push(doc.data() as MPlacesListInterface);
            });
            setPlacesList(places);
        }

        const q: Query = createPlaceQuery();
        fetchUpData(q);
    }, [searchedAddress]);

    // if (placesList.length == 0) {
    //     return <ActivityIndicator animating />
    // }

    const value: MPlacesListValInterface = {
        placesList,
        setSearchedAddress,
        // setCountry,
        // setAdministrativeAreaLevel1,
        // setAdministrativeAreaLevel2,
        // setLocality,
    }
    return <PCT011MPlacesList.Provider value={value}>{children}</PCT011MPlacesList.Provider>
}
