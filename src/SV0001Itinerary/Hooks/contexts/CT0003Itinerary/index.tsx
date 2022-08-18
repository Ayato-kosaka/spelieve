import React, { useState, createContext, useContext, useEffect, ReactNode } from 'react';
import db from 'SV0001Itinerary/fireB/firestore';
import type { DocumentData, DocumentSnapshot, DocumentReference } from 'firebase/firestore'
import { doc, collection, getDoc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import AT0005Loader from 'SV0001Itinerary/Components/atoms/AT0005Loader';
import type { ItineraryType } from 'SV0001Itinerary/Hooks/contexts/CT0003Itinerary/ItinerariesType'
import { ItineraryConverter } from './ItinerariesConverter';


export const collectionName = 'Itineraries';
const collectionRef = collection(db, collectionName).withConverter(ItineraryConverter);;


type CT0003ItineraryProviderProps = {
    itineraryID: string;
    children: ReactNode;
};

type CT0003ItineraryProviderType = {
    docSnap: DocumentSnapshot<ItineraryType> | null;
    create: () => Promise<DocumentReference<ItineraryType>>;
};


const CT0003Itinerary = createContext<CT0003ItineraryProviderType>({} as CT0003ItineraryProviderType);
export default CT0003Itinerary;


export const CT0003ItineraryProvider = (
    { itineraryID, children }: CT0003ItineraryProviderProps
) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [docSnap, setDocSnap] = useState<DocumentSnapshot<ItineraryType> | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const docRef: DocumentReference<ItineraryType> = doc(collectionRef, itineraryID || "")
            let docSnap: DocumentSnapshot<ItineraryType> = await getDoc(docRef);
            if (!docSnap.exists()) {
                const docRef: DocumentReference<ItineraryType> = await create();
                docSnap = await getDoc(docRef);
                console.log("docSnap.exists", docSnap.exists())
            }
            setDocSnap(docSnap);
            setIsLoading(false);
        };
        fetchData();
    }, [itineraryID]);

    const create = async (): Promise<DocumentReference<ItineraryType>> => {
        const itinerary: ItineraryType = { title: "" };
        return await addDoc(collectionRef, itinerary);
    };
    if (isLoading) {
        return <AT0005Loader />
    }

    const value: CT0003ItineraryProviderType = {
        docSnap,
        create,
    }
    return <CT0003Itinerary.Provider value={value}>{children}</CT0003Itinerary.Provider>
};
