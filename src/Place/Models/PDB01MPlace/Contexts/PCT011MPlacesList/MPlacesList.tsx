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

    const initialAddress = {
        country: initialCountry,
        administrativeAreaLevel1: initialAdministrativeAreaLevel1,
        administrativeAreaLevel2: initialAdministrativeAreaLevel2,
        locality: initialLocality,
    }
    const [placesList, setPlacesList] = useState<MPlacesListInterface[]>([]);
    const [searchedAddress, setSearchedAddress] = useState(initialAddress);
    // console.log(placesList);
    console.log(searchedAddress);

    useEffect(()=> {
        const createPlaceQuery = (): Query => {
            // const collectionRef = parentDocRef
            //         ? collection(parentDocRef, MPlace.modelName).withConverter(PCT011MPlacesListConverter())
            //         : collection(db, MPlace.modelName).withConverter(PCT011MPlacesListConverter());
            const placeCollectionRef = collection(db, MPlace.modelName); // .withConverter(PCT011MPlacesListConverter());
            let q: Query = query( // index済
                                placeCollectionRef,
                                where(MPlace.Cols.country, '==', searchedAddress.country),
                                orderBy('rating', 'desc')
                            );
            if (searchedAddress.administrativeAreaLevel1 !== ''){ // index済
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
    }, []);

    // if (placesList.length == 0) {
    //     return <ActivityIndicator animating />
    // }

    const value: MPlacesListValInterface = {
        placesList,
        setSearchedAddress,
    }
    return <PCT011MPlacesList.Provider value={value}>{children}</PCT011MPlacesList.Provider>
}
