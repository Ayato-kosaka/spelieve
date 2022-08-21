import { ActivityIndicator } from 'react-native-paper';
import { useState, createContext, useEffect, ReactNode } from 'react';
import db from '@/Itinerary/Endpoint/firestore'
import { collection, doc, query, QuerySnapshot, onSnapshot, addDoc, DocumentReference, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
import { IDB003PlansCols, collectionName, IDB003PlansInterface } from '@/Itinerary/Models/IDB003Plans'
import { ICT003PlansInterface } from './PlansInterface';
import { ICT003PlansConverter } from './PlansConverter';
import { ICT003PlansBuild } from './PlansBuild';

/**
 * Define value interface of useContext(ICT003Plans). 
 */
interface ICT003PlansValInterface {
    documentSnapshots: {[id:string]: QueryDocumentSnapshot<ICT003PlansInterface>};
    create: () => void;
}
export const ICT003Plans = createContext({} as ICT003PlansValInterface);

/**
 * Export Provider of ICT003Plans. 
 */
interface ICT003PlansProviderPropsInterface {
    parentDocRef?: DocumentReference;
    children: ReactNode;
}
export const ICT003PlansProvider = ({
    parentDocRef,
    children,
}: ICT003PlansProviderPropsInterface) => {
    
    const [documentSnapshots, setDocumentSnapshots] = useState<ICT003PlansValInterface['documentSnapshots']>({});
    
    const collectionRef = parentDocRef
        ?   collection(parentDocRef, collectionName).withConverter(ICT003PlansConverter())
        :   collection(db, collectionName).withConverter(ICT003PlansConverter());

    useEffect(() => {
        const fetchData = async () => {
            const unsubscribe = onSnapshot(
                query<ICT003PlansInterface>(collectionRef),
                (querySnapshot) => {
                    setDocumentSnapshots((documentSnapshots) => {
                        querySnapshot.docChanges().forEach((change) => {
                            if (change.type === "added") {
                                documentSnapshots[change.doc.id] = change.doc;
                            }
                            if (change.type === "modified") {
                                documentSnapshots[change.doc.id] = change.doc;
                            }
                            if (change.type === "removed") {
                                delete documentSnapshots[change.doc.id];
                            }
                        });
                        return { ...documentSnapshots };
                    });
                }
            );
        }
        fetchData();
    }, [parentDocRef]);

    const create: ICT003PlansValInterface['create'] = async () => {
        addDoc<ICT003PlansInterface>(collectionRef, ICT003PlansBuild());
    }

    if (!documentSnapshots) {
        return <ActivityIndicator animating={true} />
    }
    
    const value: ICT003PlansValInterface = {
        documentSnapshots,
        create,
    }
    return <ICT003Plans.Provider value={value}>{children}</ICT003Plans.Provider>
};
