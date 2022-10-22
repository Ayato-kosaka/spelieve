import { collection, query, onSnapshot, addDoc, QueryDocumentSnapshot } from 'firebase/firestore';
import { useState, createContext, useEffect, useMemo, useCallback } from 'react';

import {
	PlansMapInterface,
	PlansMapProviderPropsInterface,
	PlansMapValInterface,
} from 'spelieve-common/lib/Interfaces/Itinerary';
import { Plans } from 'spelieve-common/lib/Models/Itinerary/IDB03/Plans';

import { ICT031PlansMapConverter } from './PlansConverter';

import db from '@/Itinerary/Endpoint/firestore';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

export const ICT031PlansMap = createContext({} as PlansMapValInterface);

export function ICT031PlansMapProvider({ parentDocRef, children }: PlansMapProviderPropsInterface) {
	const [plansDocSnapMap, setDocumentSnapshots] = useState<PlansMapValInterface['plansDocSnapMap']>(
		{},
	);

	const plansCRef = useMemo(
		() =>
			parentDocRef
				? collection(parentDocRef, Plans.modelName).withConverter(FirestoreConverter<Plans, PlansMapInterface>(Plans, (data) => data, (data) => data))
				: collection(db, Plans.modelName).withConverter(FirestoreConverter<Plans, PlansMapInterface>(Plans, (data) => data, (data) => data)),
		[parentDocRef],
	);

	useEffect(() => {
		const unsubscribe = onSnapshot(query(plansCRef), (querySnapshot) => {
			setDocumentSnapshots((_plansDocSnapMap) => {
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
				return { ..._plansDocSnapMap };
			});
		});
		return () => unsubscribe();
	}, [plansCRef]);

	/* eslint react/jsx-no-constructed-context-values: 0 */
	const value: PlansMapValInterface = {
		plansDocSnapMap,
		plansCRef,
	};

	return <ICT031PlansMap.Provider value={value}>{children}</ICT031PlansMap.Provider>;
}
