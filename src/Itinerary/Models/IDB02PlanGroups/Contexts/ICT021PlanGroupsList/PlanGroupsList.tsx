import { collection, query, QuerySnapshot, onSnapshot, addDoc, orderBy, setDoc } from 'firebase/firestore';
import { useState, createContext, useEffect, useContext } from 'react';
import { ActivityIndicator } from 'react-native-paper';

import {
	PlanGroupsListInterface,
	PlanGroupsListProviderPropsInterface,
	PlanGroupsListValInterface,
} from 'spelieve-common/lib/Interfaces/Itinerary';
import { PlanGroups } from 'spelieve-common/lib/Models/Itinerary/IDB02/PlanGroups';

import { ICT021PlanGroupsListConverter } from './PlanGroupsConverter';

import * as CHK001Utils from '@/Common/Hooks/CHK001Utils';
import db from '@/Itinerary/Endpoint/firestore';
import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';

export const ICT021PlanGroupsList = createContext({} as PlanGroupsListValInterface);

export function ICT021PlanGroupsListProvider({ parentDocRef, children }: PlanGroupsListProviderPropsInterface) {
	const [querySnapshot, setQuerySnapshot] = useState<QuerySnapshot<PlanGroupsListInterface> | null>(null);

	const collectionRef = parentDocRef
		? collection(parentDocRef, PlanGroups.modelName).withConverter(ICT021PlanGroupsListConverter())
		: collection(db, PlanGroups.modelName).withConverter(ICT021PlanGroupsListConverter());

	const useICT031PlansMap = useContext(ICT031PlansMap);

	const create = async (representativeStartTime?: Date) => {
		const initData: PlanGroupsListInterface = {
			plans: [],
			representativePlanID: '',
			representativeStartTime: CHK001Utils.initialDate(),
		};
		if (representativeStartTime) {
			initData.representativeStartTime = representativeStartTime;
		}
		await addDoc<PlanGroupsListInterface>(collectionRef, {
			plans: [],
			representativePlanID: '',
			representativeStartTime: CHK001Utils.initialDate(),
		});
	};

	const insertPlan: PlanGroupsListValInterface['insertPlan'] = async (
		index: number,
		plansIndex = 0,
		planId?: string,
	) => {
		const planGroup: PlanGroupsListInterface = querySnapshot.docs[index].data();
		if (!planId) {
			planId = (await useICT031PlansMap.create()).id;
		}
		planGroup.plans.splice(plansIndex, 0, planId);
		setDoc<PlanGroupsListInterface>(querySnapshot.docs[index].ref, planGroup);
	};

	useEffect(() => {
		const unsubscribe = onSnapshot(
			query<PlanGroupsListInterface>(collectionRef, orderBy(PlanGroups.Cols.representativeStartTime)),
			(querySnap) => {
				if (querySnap.empty) {
					create();
				} else {
					querySnap.docs.forEach((queryDocumentSnapshot, index) => {
						const data: PlanGroupsListInterface = queryDocumentSnapshot.data();
						if (!data.plans.length) {
							insertPlan(index);
						}
					});
					setQuerySnapshot(querySnap);
				}
			},
		);
		return () => unsubscribe();
	}, [collectionRef, create, insertPlan]);

	if (!querySnapshot) {
		return <ActivityIndicator animating />;
	}

	const value: PlanGroupsListValInterface = {
		planGroupsQSnap: querySnapshot,
		create,
		insertPlan,
	};
	return <ICT021PlanGroupsList.Provider value={value}>{children}</ICT021PlanGroupsList.Provider>;
}
