import { ActivityIndicator } from 'react-native-paper';
import { useState, createContext, useEffect, ReactNode } from 'react';
import db from '@/Itinerary/Endpoint/firestore'
import { collection, doc, query, QuerySnapshot, onSnapshot, addDoc, DocumentReference, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
import { ICT011ItineraryOneConverter } from './ItinerariesConverter';
import { Itineraries } from 'spelieve-common/lib/Models/Itinerary/IDB01/Itineraries'

export const ICT011ItineraryOne = createContext({} as ICT011ItineraryOneValInterface);

export const ICT011ItineraryOneProvider = ({
    parentDocRef,
    children,
    id,
}: ICT011ItineraryOneProviderPropsInterface) => {
    
    const [documentSnapshot, setDocumentSnapshot] = useState<ICT011ItineraryOneValInterface['documentSnapshot'] | null>(null);
    
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

    const create: ICT011ItineraryOneValInterface['create'] = async () => {
        return await addDoc<ICT011ItineraryOneInterface>(collectionRef, ICT011ItineraryOneBuild());
    }

    if (!documentSnapshot) {
        return <ActivityIndicator animating={true} />
    }
    
    const value: ICT011ItineraryOneValInterface = {
        itinerary: documentSnapshot.id,
        reference: documentSnapshot.ref,
        create,
    }
    return <ICT011ItineraryOne.Provider value={value}>{children}</ICT011ItineraryOne.Provider>
};
