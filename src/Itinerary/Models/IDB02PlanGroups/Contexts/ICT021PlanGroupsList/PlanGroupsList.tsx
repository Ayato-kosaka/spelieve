import { collection, query, QuerySnapshot, onSnapshot, addDoc, orderBy, setDoc } from 'firebase/firestore';
import { useState, createContext, useEffect, useContext, useMemo, ReactNode } from 'react';

import { PlanGroupsListInterface, PlanGroupsListValInterface } from 'spelieve-common/lib/Interfaces/Itinerary';
import { PlanGroups } from 'spelieve-common/lib/Models/Itinerary/IDB02/PlanGroups';
import { Plans } from 'spelieve-common/lib/Models/Itinerary/IDB03/Plans';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';

export const ICT021PlanGroupsList = createContext({} as PlanGroupsListValInterface);

export const ICT021PlanGroupsListProvider = ({ children }: { children: ReactNode }) => {
	const [planGroupsQSnap, setPlanGroupsQSnap] = useState<QuerySnapshot<PlanGroupsListInterface> | undefined>(undefined);

	const { itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const { plansCRef } = useContext(ICT031PlansMap);

	const planGroupsCRef = useMemo(() => {
		if (itineraryDocSnap) {
			return collection(itineraryDocSnap.ref, PlanGroups.modelName).withConverter(
				FirestoreConverter<PlanGroups, PlanGroupsListInterface>(
					PlanGroups,
					(data) => data,
					(data) => data,
				),
			);
		}
		return undefined;
	}, [itineraryDocSnap]);

	useEffect(() => {
		if (planGroupsCRef && plansCRef) {
			const unsubscribe = onSnapshot(
				query(planGroupsCRef, orderBy(PlanGroups.Cols.representativeStartDateTime)),
				(querySnap) => {
					if (querySnap.empty) {
						// eslint-disable-next-line @typescript-eslint/no-floating-promises
						addDoc(planGroupsCRef, { ...PlanGroups.fromJSON({}) });
					} else {
						querySnap.docs.forEach((queryDocumentSnapshot) => {
							const data: PlanGroupsListInterface = queryDocumentSnapshot.data();
							if (!data.plans.length) {
								// eslint-disable-next-line @typescript-eslint/no-floating-promises
								addDoc<Plans>(plansCRef, { ...Plans.fromJSON({}) }).then((planDocRef) => {
									data.plans.push(planDocRef.id);
									// eslint-disable-next-line @typescript-eslint/no-floating-promises
									setDoc(queryDocumentSnapshot.ref, { ...data, updatedAt: new Date() });
								});
							}
						});
						setPlanGroupsQSnap(querySnap);
					}
				},
			);
			return () => unsubscribe();
		}
		return () => undefined;
	}, [planGroupsCRef, plansCRef]);

	const value: PlanGroupsListValInterface = useMemo(
		() => ({
			planGroupsQSnap,
			planGroupsCRef,
		}),
		[planGroupsQSnap, planGroupsCRef],
	);
	return <ICT021PlanGroupsList.Provider value={value}>{children}</ICT021PlanGroupsList.Provider>;
};
