import {
	collection,
	query,
	QuerySnapshot,
	onSnapshot,
	addDoc,
	DocumentReference,
	orderBy,
	setDoc,
} from 'firebase/firestore';
import { useState, createContext, useEffect, ReactNode, useContext } from 'react';
import { ActivityIndicator } from 'react-native-paper';

import { ICT021PlanGroupsListBuild } from './PlanGroupsBuild';
import { ICT021PlanGroupsListConverter } from './PlanGroupsConverter';
import { ICT021PlanGroupsListInterface } from './PlanGroupsInterface';

import { ICT031PlansMap } from '@/Itinerary/Contexts/ICT031PlansMap';
import db from '@/Itinerary/Endpoint/firestore';
import { IDB002PlanGroupsCols, collectionName } from '@/Itinerary/Models/IDB002PlanGroups';

/**
 * Define value interface of useContext(ICT021PlanGroupsList).
 */
interface ICT021PlanGroupsListValInterface {
	querySnapshot: QuerySnapshot<ICT021PlanGroupsListInterface>;
	create: (representativeStartTime?: Date) => Promise<DocumentReference>;
	insertPlan: (index: number, plansIndex?: number, planId?: string) => Promise<void>;
}
export const ICT021PlanGroupsList = createContext({} as ICT021PlanGroupsListValInterface);

/**
 * Export Provider of ICT021PlanGroupsList.
 */
interface ICT021PlanGroupsListProviderPropsInterface {
	parentDocRef?: DocumentReference;
	children: ReactNode;
}
export function ICT021PlanGroupsListProvider({ parentDocRef, children }: ICT021PlanGroupsListProviderPropsInterface) {
	const [querySnapshot, setQuerySnapshot] = useState<ICT021PlanGroupsListValInterface['querySnapshot'] | null>(null);

	const collectionRef = parentDocRef
		? collection(parentDocRef, collectionName).withConverter(ICT021PlanGroupsListConverter())
		: collection(db, collectionName).withConverter(ICT021PlanGroupsListConverter());

	const useICT031PlansMap = useContext(ICT031PlansMap);

	useEffect(() => {
		const fetchData = async () => {
			const unsubscribe = onSnapshot(
				query<ICT021PlanGroupsListInterface>(collectionRef, orderBy(IDB002PlanGroupsCols.representativeStartTime)),
				(querySnapshot) => {
					if (querySnapshot.empty) {
						create();
					} else {
						querySnapshot.docs.forEach((queryDocumentSnapshot, index) => {
							const data: ICT021PlanGroupsListInterface = queryDocumentSnapshot.data();
							if (!data.plans.length) {
								insertPlan(index);
							}
						});
						setQuerySnapshot(querySnapshot);
					}
				},
			);
		};
		fetchData();
	}, [parentDocRef]);

	const create: ICT021PlanGroupsListValInterface['create'] = async (representativeStartTime?: Date) => {
		const initData: ICT021PlanGroupsListInterface = ICT021PlanGroupsListBuild();
		if (representativeStartTime) {
			initData.representativeStartTime = representativeStartTime;
		}
		return addDoc<ICT021PlanGroupsListInterface>(collectionRef, ICT021PlanGroupsListBuild());
	};

	if (!querySnapshot) {
		return <ActivityIndicator animating />;
	}

	const insertPlan: ICT021PlanGroupsListValInterface['insertPlan'] = async (
		index: number,
		plansIndex = 0,
		planId?: string,
	) => {
		const planGroup: ICT021PlanGroupsListInterface = querySnapshot.docs[index].data();
		if (!planId) {
			planId = (await useICT031PlansMap.create()).id;
		}
		planGroup.plans.splice(plansIndex, 0, planId);
		setDoc<ICT021PlanGroupsListInterface>(querySnapshot.docs[index].ref, planGroup);
	};

	const value: ICT021PlanGroupsListValInterface = {
		querySnapshot,
		create,
		insertPlan,
	};
	return <ICT021PlanGroupsList.Provider value={value}>{children}</ICT021PlanGroupsList.Provider>;
}
