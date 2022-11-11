import { addDoc, QueryDocumentSnapshot, setDoc } from 'firebase/firestore';
import { useContext, useEffect } from 'react';
import { Button, View } from 'react-native';

import { PlanGroupsListInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT021';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../../PlansMap';

import i18n from '@/Common/Hooks/i18n-js';
import { IMC03101PlanEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03101PlanEdit';
import { IMC03102TrafficMovementEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03102TrafficMovementEdit';

export function IMC03103PlanGroupsEdit({
	planGroupsDoc,
}: {
	planGroupsDoc: QueryDocumentSnapshot<PlanGroupsListInterface>;
}) {
	const { plansCRef } = useContext(ICT031PlansMap);

	useEffect(() => {}, []);

	const addPlan = async (index: number) => {
		const planDocRef = await addDoc(plansCRef!, {
			title: '',
			placeSpan: DateUtils.initialDate(),
			placeStartTime: DateUtils.initialDate(),
			placeEndTime: DateUtils.initialDate(),
			tags: [],
			transportationSpan: DateUtils.initialDate(),
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		const data = { ...planGroupsDoc.data() };
		data.plans.splice(index - 1, 0, planDocRef.id);
		await setDoc(planGroupsDoc.ref, { ...data });
	};

	return (
		<View key={planGroupsDoc.id} style={{ width: '100%' }}>
			{planGroupsDoc.data().plans.map((planID, index) => (
				<View key={planID}>
					<IMC03101PlanEdit planID={planID} />
					<IMC03102TrafficMovementEdit planID={planID} />
					<Button
						title={i18n.t('予定を追加')}
						onPress={() => {
							// eslint-disable-next-line @typescript-eslint/no-floating-promises
							addPlan(index);
						}}
					/>
				</View>
			))}
		</View>
	);
}
