import { collection, query, onSnapshot } from 'firebase/firestore';
import { useState, createContext, useEffect, useMemo, useContext, ReactNode } from 'react';

import {
	PlansMapInterface,
	PlansMapValInterface,
} from 'spelieve-common/lib/Interfaces/Itinerary';
import { Plans } from 'spelieve-common/lib/Models/Itinerary/IDB03/Plans';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';

export const ICT031PlansMap = createContext({} as PlansMapValInterface);

export function ICT031PlansMapProvider({ children }: { children: ReactNode }) {
	const [plansDocSnapMap, setDocumentSnapshots] = useState<PlansMapValInterface['plansDocSnapMap']>({});
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const { itineraryDocSnap } = useContext(ICT011ItineraryOne);

	const plansCRef = useMemo(() => {
		if (itineraryDocSnap) {
			return collection(itineraryDocSnap.ref, Plans.modelName).withConverter(
				FirestoreConverter<Plans, PlansMapInterface>(
					Plans,
					(data) => data,
					(data) => data,
				),
			);
		}
		return undefined;
	}, [itineraryDocSnap]);

	useEffect(() => {
		if (plansCRef) {
			const unsubscribe = onSnapshot(query(plansCRef), (querySnapshot) => {
				setDocumentSnapshots((_plansDocSnapMap) => {
					setIsLoading(true);
					querySnapshot.docChanges().forEach((change) => {
						if (change.type === 'added') {
							_plansDocSnapMap[change.doc.id] = change.doc;
						}
						if (change.type === 'modified') {
							_plansDocSnapMap[change.doc.id] = change.doc;
						}
						if (change.type === 'removed') {
							delete _plansDocSnapMap[change.doc.id];
						}
					});
					setIsLoading(false);
					return { ..._plansDocSnapMap };
				});
			});
			return () => unsubscribe();
		}
		return () => undefined;
	}, [plansCRef]);

	/* eslint react/jsx-no-constructed-context-values: 0 */
	const value: PlansMapValInterface = {
		plansDocSnapMap,
		plansCRef,
		isLoading,
	};

	return <ICT031PlansMap.Provider value={value}>{children}</ICT031PlansMap.Provider>;
}
