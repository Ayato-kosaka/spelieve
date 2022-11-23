import { collection, query, QuerySnapshot, onSnapshot, addDoc, orderBy, setDoc } from 'firebase/firestore';
import { useState, createContext, useEffect, useContext, useMemo, ReactNode } from 'react';

import { PlanGroupsListInterface, PlanGroupsListValInterface } from 'spelieve-common/lib/Interfaces/Itinerary';
import { PlanGroups } from 'spelieve-common/lib/Models/Itinerary/IDB02/PlanGroups';
import { Plans } from 'spelieve-common/lib/Models/Itinerary/IDB03/Plans';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';
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
						addDoc(planGroupsCRef, {
							plans: [],
							representativePlanID: '',
							dayNumber: 0,
							time: DateUtils.initialDate(),
							representativeStartDateTime: DateUtils.initialDate(),
							createdAt: new Date(),
							updatedAt: new Date(),
						});
					} else {
						querySnap.docs.forEach((queryDocumentSnapshot) => {
							const plans = [...queryDocumentSnapshot.data().plans];
							if (plans.length === 0) {
								// eslint-disable-next-line @typescript-eslint/no-floating-promises
								addDoc<Plans>(plansCRef, {
									title: '',
									placeSpan: DateUtils.initialDate(),
									placeStartTime: new Date(),
									placeEndTime: new Date(),
									tags: [],
									transportationSpan: DateUtils.initialDate(),
									avoidFerries: false,
									avoidHighways: false,
									avoidTolls: false,
									transitModes: [
										google.maps.TransitMode.BUS,
										google.maps.TransitMode.RAIL,
										google.maps.TransitMode.SUBWAY,
										google.maps.TransitMode.TRAIN,
										google.maps.TransitMode.TRAM,
									],
									transitRoutePreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS,
									createdAt: new Date(),
									updatedAt: new Date(),
								}).then((planDocRef) => {
									plans.push(planDocRef.id);
									// eslint-disable-next-line @typescript-eslint/no-floating-promises
									setDoc(
										queryDocumentSnapshot.ref,
										{ plans, representativeStartDateTime: new Date(), representativePlanID: planDocRef.id },
										{ merge: true },
									);
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
