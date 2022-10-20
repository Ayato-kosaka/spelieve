import { ActivityIndicator } from 'react-native-paper';
import { useState, createContext, useEffect, ReactNode } from 'react';
import db from '@/Itinerary/Endpoint/firestore'
import { collection, doc, query, QuerySnapshot, onSnapshot, addDoc, DocumentReference, DocumentSnapshot, QueryDocumentSnapshot, setDoc } from 'firebase/firestore';
import { ICT011ItineraryOneConverter } from './ItinerariesConverter';
import { Itineraries } from 'spelieve-common/lib/Models/Itinerary/IDB01/Itineraries'
import { ItineraryOneInterface, ItineraryOneProviderPropsInterface, ItineraryOneValInterface } from 'spelieve-common/lib/Interfaces/Itinerary'

export const ICT011ItineraryOne = createContext({});

export const ICT011ItineraryOneProvider = ({
    parentDocRef,
    children,
    id,
}: ItineraryOneProviderPropsInterface) => {
    
    const [documentSnapshot, setDocumentSnapshot] = useState<DocumentSnapshot<ItineraryOneInterface> | null>(null);
    
    const collectionRef = parentDocRef
        ?   collection(parentDocRef, Itineraries.modelName).withConverter(ICT011ItineraryOneConverter())
        :   collection(db, Itineraries.modelName).withConverter(ICT011ItineraryOneConverter());

    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(collectionRef, id),
            (documentSnapshot) => {
                if (!documentSnapshot.exists()) {
                    create();
                } else {
                    setDocumentSnapshot(documentSnapshot);
                }
            }
        );
        return unsubscribe()
    }, [parentDocRef, id]);

    if (!documentSnapshot) {
        return <ActivityIndicator animating={true} />
    }

    const create = async () => {
        // return await addDoc<ICT011ItineraryOneInterface>(collectionRef, ICT011ItineraryOneBuild());
    }

    const update = async (itinerary: ItineraryOneInterface) => {
        return await setDoc<ItineraryOneInterface>(documentSnapshot.ref, itinerary);
    }
    
    const value: ItineraryOneValInterface = {
        itinerary: documentSnapshot.data()!,
        reference: documentSnapshot.ref,
        create,
    }
    return <ICT011ItineraryOne.Provider value={value}>{children}</ICT011ItineraryOne.Provider>
};
