import { collection, query, QuerySnapshot, onSnapshot, addDoc, orderBy, setDoc } from 'firebase/firestore';
import { useState, createContext, useEffect, useContext, useMemo } from 'react';
import { ActivityIndicator } from 'react-native-paper';

import {
	PlanGroupsListInterface,
	PlanGroupsListProviderPropsInterface,
	PlanGroupsListValInterface,
	PlansMapInterface,
} from 'spelieve-common/lib/Interfaces/Itinerary';
import { PlanGroups } from 'spelieve-common/lib/Models/Itinerary/IDB02/PlanGroups';
import { Plans } from 'spelieve-common/lib/Models/Itinerary/IDB03/Plans';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import db from '@/Itinerary/Endpoint/firestore';
import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';

export const ICT021PlanGroupsList = createContext({} as PlanGroupsListValInterface);

export function ICT021PlanGroupsListProvider({ parentDocRef, children }: PlanGroupsListProviderPropsInterface) {
	const [planGroupsQSnap, setPlanGroupsQSnap] = useState<QuerySnapshot<PlanGroupsListInterface> | null>(null);

	const planGroupsCRef = useMemo(
		() =>
			parentDocRef
				? collection(parentDocRef, PlanGroups.modelName).withConverter(
						FirestoreConverter<PlanGroups, PlanGroupsListInterface>(
							PlanGroups,
							(data) => data,
							(data) => data,
						),
				  )
				: collection(db, PlanGroups.modelName).withConverter(
						FirestoreConverter<PlanGroups, PlanGroupsListInterface>(
							PlanGroups,
							(data) => data,
							(data) => data,
						),
				  ),
		[parentDocRef],
	);

	const useICT031PlansMap = useContext(ICT031PlansMap);

	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(planGroupsCRef, orderBy(PlanGroups.Cols.representativeStartTime)),
			(querySnap) => {
				if (querySnap.empty) {
					/* eslint @typescript-eslint/no-floating-promises: 0 */
					addDoc(planGroupsCRef, { ...PlanGroups.fromJSON({}) });
				} else {
					querySnap.docs.forEach((queryDocumentSnapshot, index) => {
						const data: PlanGroupsListInterface = queryDocumentSnapshot.data();
						if (!data.plans.length) {
							addDoc<PlansMapInterface>(useICT031PlansMap.plansCRef, { ...Plans.fromJSON({}) }).then((planDocRef) => {
								data.plans.push(planDocRef.id);
								/* eslint @typescript-eslint/no-floating-promises: 0 */
								setDoc(queryDocumentSnapshot.ref, { ...data });
							});
						}
					});
					setPlanGroupsQSnap(querySnap);
				}
			},
		);
		return () => unsubscribe();
	}, [planGroupsCRef, useICT031PlansMap.plansCRef]);

	if (!planGroupsQSnap) {
		return <ActivityIndicator animating />;
	}

	/* eslint react/jsx-no-constructed-context-values: 0 */
	const value: PlanGroupsListValInterface = {
		planGroupsQSnap,
		planGroupsCRef,
	};
	return <ICT021PlanGroupsList.Provider value={value}>{children}</ICT021PlanGroupsList.Provider>;
}
