import { ActivityIndicator } from 'react-native-paper';
import { useState, createContext, useEffect, ReactNode } from 'react';
import { collection, query, orderBy, QuerySnapshot, onSnapshot, addDoc, DocumentReference } from 'firebase/firestore';

import db from '@/Itinerary/Endpoint/firestore';
import * as CHK001Utils from '@/Common/Hooks/CHK001Utils'
import { IDB002PlanGroupsCols, collectionName } from '@/Itinerary/Models/IDB002PlanGroups'

import { ICT002PlanGroupsInterface } from './PlanGroupsInterface';
import { ICT002PlanGroupsConverter } from './PlanGroupsConverter'


interface ICT002PlanGroupsValInterface {
    querySnapshot: QuerySnapshot<ICT002PlanGroupsInterface>;
    create: (representativeStartTime?: Date) => void;
}
export const ICT002PlanGroups = createContext({} as ICT002PlanGroupsValInterface);


interface ICT002PlanGroupsProviderPropsInterface {
    parentDocRef: DocumentReference;
    children: ReactNode;
}
export const ICT002PlanGroupsProvider = ({
    parentDocRef,
    children
}: ICT002PlanGroupsProviderPropsInterface) => {
    const [querySnapshot, setQuerySnapshot] = useState<ICT002PlanGroupsValInterface['querySnapshot']>();
    
    const collectionRef = collection(parentDocRef, collectionName).withConverter(ICT002PlanGroupsConverter());

    useEffect(() => {
        const fetchData = async () => {
            const unsubscribe = onSnapshot(
                query<ICT002PlanGroupsInterface>(collectionRef, orderBy(IDB002PlanGroupsCols.representativeStartTime)),
                (quertSnapshot) => {
                    if(quertSnapshot.empty){
                        create();
                    }
                    quertSnapshot.docs.forEach((queryDocumentSnapshot) => {
                        const data: ICT002PlanGroupsInterface = queryDocumentSnapshot.data();
                        if(!data.plans.length){
                            // TODO addPlan
                        }
                    });
                    setQuerySnapshot(quertSnapshot);
                }
            );
        }
        fetchData();
    }, [parentDocRef]);

    const create: ICT002PlanGroupsValInterface['create'] = async (representativeStartTime = CHK001Utils.initialDate()) => {
        addDoc<ICT002PlanGroupsInterface>(collectionRef, {
            plans: [],
            representativePlanID: '',
            representativeStartTime: representativeStartTime
        })
    }


    if (!querySnapshot) {
        return <ActivityIndicator animating={true} />
    }
    
    const value: ICT002PlanGroupsValInterface = {
        querySnapshot,
        create,
    }
    return <ICT002PlanGroups.Provider value={value}>{children}</ICT002PlanGroups.Provider>
};
