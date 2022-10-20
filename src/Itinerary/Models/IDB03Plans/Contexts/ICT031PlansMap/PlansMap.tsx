import { ActivityIndicator } from 'react-native-paper';
import { useState, createContext, useEffect, ReactNode } from 'react';
import db from '@/Itinerary/Endpoint/firestore'
import { collection, doc, query, QuerySnapshot, onSnapshot, addDoc, DocumentReference, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
import { IDB003PlansCols, collectionName, IDB003PlansInterface } from '@/Itinerary/Models/IDB003Plans'
import { ICT031PlansMapInterface } from './PlansInterface';
import { ICT031PlansMapConverter } from './PlansConverter';
import { ICT031PlansMapBuild } from './PlansBuild';

/**
 * Define value interface of useContext(ICT031PlansMap). 
 */
interface ICT031PlansMapValInterface {
    documentSnapshots: {[id:string]: QueryDocumentSnapshot<ICT031PlansMapInterface>};
    create: () => Promise<DocumentReference>;
}
export const ICT031PlansMap = createContext({} as ICT031PlansMapValInterface);

/**
 * Export Provider of ICT031PlansMap. 
 */
interface ICT031PlansMapProviderPropsInterface {
    parentDocRef?: DocumentReference;
    children: ReactNode;
}
export const ICT031PlansMapProvider = ({
    parentDocRef,
    children,
}: ICT031PlansMapProviderPropsInterface) => {
    
    const [documentSnapshots, setDocumentSnapshots] = useState<ICT031PlansMapValInterface['documentSnapshots']>({});
    
    const collectionRef = parentDocRef
        ?   collection(parentDocRef, collectionName).withConverter(ICT031PlansMapConverter())
        :   collection(db, collectionName).withConverter(ICT031PlansMapConverter());

    useEffect(() => {
        const fetchData = async () => {
            const unsubscribe = onSnapshot(
                query<ICT031PlansMapInterface>(collectionRef),
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

    const create: ICT031PlansMapValInterface['create'] = async () => {
        return await addDoc<ICT031PlansMapInterface>(collectionRef, ICT031PlansMapBuild());
    }
    
    const value: ICT031PlansMapValInterface = {
        documentSnapshots,
        create,
    }
    return <ICT031PlansMap.Provider value={value}>{children}</ICT031PlansMap.Provider>
};
