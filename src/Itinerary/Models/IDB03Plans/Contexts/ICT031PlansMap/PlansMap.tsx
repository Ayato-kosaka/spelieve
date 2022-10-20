import { collection, query, onSnapshot, addDoc, QueryDocumentSnapshot } from 'firebase/firestore';
import { useState, createContext, useEffect } from 'react';

import {
	PlansMapInterface,
	PlansMapProviderPropsInterface,
	PlansMapValInterface,
} from 'spelieve-common/lib/Interfaces/Itinerary';
import { Plans } from 'spelieve-common/lib/Models/Itinerary/IDB03/Plans';

import { ICT031PlansMapConverter } from './PlansConverter';

import * as CHK001Utils from '@/Common/Hooks/CHK001Utils';
import db from '@/Itinerary/Endpoint/firestore';

export const ICT031PlansMap = createContext({} as PlansMapValInterface);

export function ICT031PlansMapProvider({ parentDocRef, children }: PlansMapProviderPropsInterface) {
	const [plansDocSnapMap, setDocumentSnapshots] = useState<{ [id: string]: QueryDocumentSnapshot<PlansMapInterface> }>(
		{},
	);

	const collectionRef = parentDocRef
		? collection(parentDocRef, Plans.modelName).withConverter(ICT031PlansMapConverter())
		: collection(db, Plans.modelName).withConverter(ICT031PlansMapConverter());

	useEffect(() => {
		const unsubscribe = onSnapshot(query<PlansMapInterface>(collectionRef), (querySnapshot) => {
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
	}, [collectionRef]);

	const create = async () => {
		await addDoc<PlansMapInterface>(collectionRef, {
			placeSpan: CHK001Utils.initialDate(),
			placeStartTime: CHK001Utils.initialDate(),
			placeEndTime: CHK001Utils.initialDate(),
			imageUrl: '',
			transportationSpan: CHK001Utils.initialDate(),
		});
	};

	const value: PlansMapValInterface = {
		plansDocSnapMap,
		create,
	};
	return <ICT031PlansMap.Provider value={value}>{children}</ICT031PlansMap.Provider>;
}
