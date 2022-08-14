import { useState, createContext, useEffect, ReactNode } from 'react';
import { collection, query, QueryDocumentSnapshot, onSnapshot, addDoc, DocumentReference } from 'firebase/firestore';

import * as CHK001Utils from '@/Common/Hooks/CHK001Utils'

import { ICT003PlansInterface } from './PlansInterface';
import { ICT003PlansConverter } from './PlansConverter';


type ICT003PlansValType = {
    documentSnapshots: {[id:string]: QueryDocumentSnapshot<ICT003PlansInterface>};
    create: (representativeStartTime?: Date) => void;
}
export const ICT003Plans = createContext({} as ICT003PlansValType);


type ICT003PlansProviderPropsType = {
    parentDocRef: DocumentReference;
    children: ReactNode;
}
export const ICT003PlansProvider = ({
    parentDocRef,
    children
}: ICT003PlansProviderPropsType) => {
    const collectionName: string = 'Plans';
    const [documentSnapshots, setDocumentSnapshots] = useState<ICT003PlansValType['documentSnapshots']>({});
    
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

    const create: ICT003PlansValType['create'] = async () => {
        await addDoc<ICT003PlansInterface>(collectionRef, {
            title: '',
            span: CHK001Utils.initialDate(),
        })
    }
    
    const value: ICT003PlansValType = {
        documentSnapshots,
        create,
    }
    return <ICT003Plans.Provider value={value}>{children}</ICT003Plans.Provider>
};
