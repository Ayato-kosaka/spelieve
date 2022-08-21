import { ActivityIndicator } from 'react-native-paper';
import { useState, createContext, useEffect, ReactNode } from 'react';
import db from '@/Itinerary/Endpoint/firestore'
import { collection, doc, query, QuerySnapshot, onSnapshot, addDoc, DocumentReference, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
import { IDB001ItinerariesCols, collectionName, IDB001ItinerariesInterface } from '@/Itinerary/Models/IDB001Itineraries'
import { ICT001ItinerariesInterface } from './ItinerariesInterface';
import { ICT001ItinerariesConverter } from './ItinerariesConverter';
import { ICT001ItinerariesBuild } from './ItinerariesBuild';

/**
 * Define value interface of useContext(ICT001Itineraries). 
 */
interface ICT001ItinerariesValInterface {
    documentSnapshot: DocumentSnapshot<ICT001ItinerariesInterface>;
    create: () => Promise<void>;
}
export const ICT001Itineraries = createContext({} as ICT001ItinerariesValInterface);

/**
 * Export Provider of ICT001Itineraries. 
 */
interface ICT001ItinerariesProviderPropsInterface {
    parentDocRef?: DocumentReference;
    children: ReactNode;
    id: string;
}
export const ICT001ItinerariesProvider = ({
    parentDocRef,
    children,
    id,
}: ICT001ItinerariesProviderPropsInterface) => {
    
    const [documentSnapshot, setDocumentSnapshot] = useState<ICT001ItinerariesValInterface['documentSnapshot'] | null>(null);
    
    const collectionRef = parentDocRef
        ?   collection(parentDocRef, collectionName).withConverter(ICT001ItinerariesConverter())
        :   collection(db, collectionName).withConverter(ICT001ItinerariesConverter());

    useEffect(() => {
        const fetchData = async () => {
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
        }
        fetchData();
    }, [parentDocRef, id]);

    const create: ICT001ItinerariesValInterface['create'] = async () => {
        addDoc<ICT001ItinerariesInterface>(collectionRef, ICT001ItinerariesBuild());
    }

    if (!documentSnapshot) {
        return <ActivityIndicator animating={true} />
    }
    
    const value: ICT001ItinerariesValInterface = {
        documentSnapshot,
        create,
    }
    return <ICT001Itineraries.Provider value={value}>{children}</ICT001Itineraries.Provider>
};
