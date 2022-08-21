import { ActivityIndicator } from 'react-native-paper';
import { useState, createContext, useEffect, ReactNode } from 'react';
import db from '@/Itinerary/Endpoint/firestore'
import { collection, doc, query, QuerySnapshot, onSnapshot, addDoc, DocumentReference, DocumentSnapshot, QueryDocumentSnapshot, orderBy } from 'firebase/firestore';
import { IDB002PlanGroupsCols, collectionName, IDB002PlanGroupsInterface } from '@/Itinerary/Models/IDB002PlanGroups'
import { ICT002PlanGroupsInterface } from './PlanGroupsInterface';
import { ICT002PlanGroupsConverter } from './PlanGroupsConverter';
import { ICT002PlanGroupsBuild } from './PlanGroupsBuild';
import * as CHK001Utils from '@/Common/Hooks/CHK001Utils';

/**
 * Define value interface of useContext(ICT002PlanGroups). 
 */
interface ICT002PlanGroupsValInterface {
    querySnapshot: QuerySnapshot<ICT002PlanGroupsInterface>;
    create: () => Promise<void>;
}
export const ICT002PlanGroups = createContext({} as ICT002PlanGroupsValInterface);

/**
 * Export Provider of ICT002PlanGroups. 
 */
interface ICT002PlanGroupsProviderPropsInterface {
    parentDocRef?: DocumentReference;
    children: ReactNode;
}
export const ICT002PlanGroupsProvider = ({
    parentDocRef,
    children,
}: ICT002PlanGroupsProviderPropsInterface) => {
    
    const [querySnapshot, setQuerySnapshot] = useState<ICT002PlanGroupsValInterface['querySnapshot'] | null>(null);
    
    const collectionRef = parentDocRef
        ?   collection(parentDocRef, collectionName).withConverter(ICT002PlanGroupsConverter())
        :   collection(db, collectionName).withConverter(ICT002PlanGroupsConverter());

    useEffect(() => {
        const fetchData = async () => {
            const unsubscribe = onSnapshot(
                query<ICT002PlanGroupsInterface>(collectionRef, orderBy(IDB002PlanGroupsCols.representativeStartTime)),
                (querySnapshot) => {
                    if(querySnapshot.empty){
                        create();
                    } else {
                        setQuerySnapshot(querySnapshot);
                    }
                }
            );
        }
        fetchData();
    }, [parentDocRef]);

    const create: ICT002PlanGroupsValInterface['create'] = async (representativeStartTime?: Date) => {
        const initData: ICT002PlanGroupsInterface = ICT002PlanGroupsBuild();
        if(representativeStartTime){
            initData.representativeStartTime = representativeStartTime;
        }
        addDoc<ICT002PlanGroupsInterface>(collectionRef, ICT002PlanGroupsBuild());
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
