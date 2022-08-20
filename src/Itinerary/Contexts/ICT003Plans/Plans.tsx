import { useState, createContext, useEffect, ReactNode } from 'react';
import { collection, query, QueryDocumentSnapshot, onSnapshot, addDoc, DocumentReference } from 'firebase/firestore';
import { collectionName, IDB003PlansInterface } from '@/Itinerary/Models/IDB003Plans'
import * as CHK001Utils from '@/Common/Hooks/CHK001Utils'

import { ICT003PlansInterface } from './PlansInterface';
import { ICT003PlansConverter } from './PlansConverter';


interface ICT003PlansValInterface {
    documentSnapshots: {[id:string]: QueryDocumentSnapshot<ICT003PlansInterface>};
    create: (representativeStartTime?: Date) => void;
}
export const ICT003Plans = createContext({} as ICT003PlansValInterface);


interface ICT003PlansProviderPropsInterface {
    parentDocRef: DocumentReference;
    children: ReactNode;
}
export const ICT003PlansProvider = ({
    parentDocRef,
    children
}: ICT003PlansProviderPropsInterface) => {
    const [documentSnapshots, setDocumentSnapshots] = useState<ICT003PlansValInterface['documentSnapshots']>({});
    
    const collectionRef = collection(parentDocRef, collectionName).withConverter(ICT003PlansConverter());

    useEffect(() => {
        const fetchData = async () => {
            const unsubscribe = onSnapshot(
                query<ICT003PlansInterface>(collectionRef),
                (quertSnapshot) => {
                    setDocumentSnapshots((documentSnapshots) => {
                        quertSnapshot.docChanges().forEach((change) => {
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
        await addDoc<IDB003PlansInterface>(collectionRef, {
            title: '',
            span: CHK001Utils.initialDate(),
        })
    }
    
    const value: ICT003PlansValInterface = {
        documentSnapshots,
        create,
    }
    return <ICT003Plans.Provider value={value}>{children}</ICT003Plans.Provider>
};
