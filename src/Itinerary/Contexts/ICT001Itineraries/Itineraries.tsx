import { useState, createContext, useEffect, ReactNode } from 'react';
import db from '@/Itinerary/Endpoint/firestore'

import { collection, onSnapshot, doc, addDoc, getDoc, DocumentReference, DocumentSnapshot } from 'firebase/firestore';

import { ICT001ItinerariesInterface } from './ItinerariesInterface';
import { ICT001ItinerariesConverter } from './ItinerariesConverter';

interface ICTItinerariesValInterface {
    documentSnapshot: DocumentSnapshot<ICT001ItinerariesInterface> | null;
    create: () => Promise<DocumentReference<ICT001ItinerariesInterface>>;
}
export const ICT001Itineraries = createContext({} as ICTItinerariesValInterface);

interface ICT001ItinerariesProviderPropsInterface {
    itineraryID: string;
    children: ReactNode;
}

export const ICT001ItinerariesProvider = (
    {itineraryID, children }: ICT001ItinerariesProviderPropsInterface
) => {
    const collectionName: string = 'Itineraries';
    const [documentSnapshot, setDocumentSnapshot] = useState<ICTItinerariesValInterface['documentSnapshot']>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const collectionRef = collection(db, collectionName).withConverter(ICT001ItinerariesConverter());

    useEffect(() => {
        const fetchData = async () => {
            const docRef: DocumentReference<ICT001ItinerariesInterface> = doc(collectionRef, itineraryID || "");
            let docSnap: DocumentSnapshot<ICT001ItinerariesInterface> = await getDoc(docRef);
            if (!docSnap.exists()) {
                const docRef: DocumentReference<ICT001ItinerariesInterface> = await create();
                docSnap = await getDoc(docRef);
            }
            setDocumentSnapshot(docSnap);
            setIsLoading(false);

            const unsubscribe = onSnapshot(
                docRef,
                (doc) => {
                    setDocumentSnapshot(doc);
                }
            );
        }
        fetchData();
    }, [itineraryID]);

    const create: ICTItinerariesValInterface['create'] = async () => {
        return await addDoc<ICT001ItinerariesInterface>(collectionRef, {
            title: '',
        });
    }

    const value: ICTItinerariesValInterface = {
        documentSnapshot,
        create,
    }

    return <ICT001Itineraries.Provider value={value}>{children}</ICT001Itineraries.Provider>
};