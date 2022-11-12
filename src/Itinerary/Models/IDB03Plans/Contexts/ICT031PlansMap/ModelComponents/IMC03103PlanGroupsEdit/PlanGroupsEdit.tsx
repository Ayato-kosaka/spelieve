import { addDoc, deleteDoc, doc, QueryDocumentSnapshot, setDoc } from 'firebase/firestore';
import { useContext, useEffect } from 'react';
import { Button, TextInputChangeEventData, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

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
	const planGroups = planGroupsDoc.data();

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
		const data = { ...planGroups };
		data.plans.splice(index - 1, 0, planDocRef.id);
		await setDoc(planGroupsDoc.ref, { ...data, updatedAt: new Date() });
	};

	const deletePlan = async (index: number) => {
		const data = { ...planGroups };
		const planId = data.plans.splice(index, 1);
		await setDoc(planGroupsDoc.ref, { ...data, updatedAt: new Date() });
		await deleteDoc(doc(plansCRef!, planId[0]));
	};

	let representativeFounded = false;

	return (
		<View style={{ width: '100%' }}>
			<Text>representativePlanID = {planGroups.representativePlanID}</Text>

			<TextInput
				label={i18n.t('representativeStartDateTime')}
				value={(planGroups.representativeStartDateTime.getTime() + 32400000).toString()}
				onChange={({ nativeEvent }: { nativeEvent: TextInputChangeEventData }) => {
					setDoc(planGroupsDoc.ref, {
						...planGroups,
						representativeStartDateTime: new Date((parseInt(nativeEvent.text, 10) || 0) - 32400000),
						updatedAt: new Date(),
					});
				}}
			/>
			{planGroups.plans.map((planID, index) => {
				const beforeAfterRepresentativeType = (() => {
					if (representativeFounded) {
						return 'after';
					}
					if (planID === planGroups.representativePlanID) {
						representativeFounded = true;
						return 'representative';
					}
					return 'before';
				})();
				return (
					<View key={planID}>
						<IMC03101PlanEdit
							planID={planID}
							beforeAfterRepresentativeType={beforeAfterRepresentativeType}
							planGroupsDoc={planGroupsDoc}
						/>
						<IMC03102TrafficMovementEdit planID={planID} />
						<Button
							title={i18n.t('予定を追加')}
							onPress={() => {
								// eslint-disable-next-line @typescript-eslint/no-floating-promises
								addPlan(index);
							}}
						/>
						<Button
							title={i18n.t('予定を削除')}
							onPress={() => {
								// eslint-disable-next-line @typescript-eslint/no-floating-promises
								deletePlan(index);
							}}
						/>
					</View>
				);
			})}
		</View>
	);
}
