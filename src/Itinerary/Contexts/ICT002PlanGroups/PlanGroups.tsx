import { ActivityIndicator } from 'react-native-paper';
import { useState, createContext, useEffect, ReactNode } from 'react';
import { collection, query, orderBy, QuerySnapshot, onSnapshot, addDoc, FieldPath } from 'firebase/firestore';

import db from '@/Itinerary/Endpoint/firestore';
import { IDB002PlanGroupsInterface } from '@/Itinerary/Interfaces/IDB002PlanGroupsInterface'

import { ICT002PlanGroupsInterface } from './PlanGroupsInterface';
import { ICT002PlanGroupsConverter } from './PlanGroupsConverter'


type ICT002PlanGroupsProviderType = {
    querySnapshot: QuerySnapshot<ICT002PlanGroupsInterface>;
    createPlanGroup: (representativeStartTime?: Date) => void;
}
export const ICT002PlanGroups = createContext({} as ICT002PlanGroupsProviderType);


type ICT002PlanGroupsProviderPropsType = {
    collectionPath: string;
    children: ReactNode;
}
export const ICT002PlanGroupsProvider = ({
    collectionPath,
    children
}: ICT002PlanGroupsProviderPropsType) => {
    const [querySnapshot, setQuerySnapshot] = useState<ICT002PlanGroupsProviderType['querySnapshot']>();
    
    const collectionRef = collection(db, collectionPath).withConverter(ICT002PlanGroupsConverter());

    useEffect(() => {
        const fetchData = async () => {
            const orderField: keyof IDB002PlanGroupsInterface = 'representativeStartTime';
            const unsubscribe = onSnapshot(
                query<ICT002PlanGroupsInterface>(collectionRef, orderBy(orderField)),
                (quertSnapshot) => {
                    if(quertSnapshot.empty){
                        createPlanGroup();
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
    }, [collectionPath]);

    const createPlanGroup: ICT002PlanGroupsProviderType['createPlanGroup'] = async (representativeStartTime = new Date(1970, 0, 1, 0, 0, 0)) => {
        addDoc<ICT002PlanGroupsInterface>(collectionRef, {
            plans: [],
            representativePlanID: '',
            representativeStartTime: representativeStartTime
        })
    }


    if (!querySnapshot) {
        return <ActivityIndicator animating={true} />
    }
    
    const value: ICT002PlanGroupsProviderType = {
        querySnapshot,
        createPlanGroup,
    }
    return <ICT002PlanGroups.Provider value={value}>{children}</ICT002PlanGroups.Provider>
};
