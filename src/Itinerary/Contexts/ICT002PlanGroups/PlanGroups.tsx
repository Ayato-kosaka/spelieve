import { ActivityIndicator } from 'react-native-paper';
import { useState, createContext, useEffect, ReactNode } from 'react';
import { collection, query, orderBy, QuerySnapshot, onSnapshot, addDoc, DocumentReference } from 'firebase/firestore';

import db from '@/Itinerary/Endpoint/firestore';
import * as CHK001Utils from '@/Common/Hooks/CHK001Utils'
import { IDB002PlanGroupsInterface } from '@/Itinerary/Interfaces/IDB002PlanGroupsInterface'

import { ICT002PlanGroupsInterface } from './PlanGroupsInterface';
import { ICT002PlanGroupsConverter } from './PlanGroupsConverter'


type ICT002PlanGroupsValType = {
    querySnapshot: QuerySnapshot<ICT002PlanGroupsInterface>;
    create: (representativeStartTime?: Date) => void;
}
export const ICT002PlanGroups = createContext({} as ICT002PlanGroupsValType);


type ICT002PlanGroupsProviderPropsType = {
    parentDocRef: DocumentReference;
    children: ReactNode;
}
export const ICT002PlanGroupsProvider = ({
    parentDocRef,
    children
}: ICT002PlanGroupsProviderPropsType) => {
    const collectionName: string = 'PlanGroups';
    const [querySnapshot, setQuerySnapshot] = useState<ICT002PlanGroupsValType['querySnapshot']>();
    
    const collectionRef = collection(parentDocRef, collectionName).withConverter(ICT002PlanGroupsConverter());

    useEffect(() => {
        const fetchData = async () => {
            const orderField: keyof IDB002PlanGroupsInterface = 'representativeStartTime';
            const unsubscribe = onSnapshot(
                query<ICT002PlanGroupsInterface>(collectionRef, orderBy(orderField)),
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

    const create: ICT002PlanGroupsValType['create'] = async (representativeStartTime = CHK001Utils.initialDate()) => {
        addDoc<ICT002PlanGroupsInterface>(collectionRef, {
            plans: [],
            representativePlanID: '',
            representativeStartTime: representativeStartTime
        })
    }


    if (!querySnapshot) {
        return <ActivityIndicator animating={true} />
    }
    
    const value: ICT002PlanGroupsValType = {
        querySnapshot,
        create,
    }
    return <ICT002PlanGroups.Provider value={value}>{children}</ICT002PlanGroups.Provider>
};
