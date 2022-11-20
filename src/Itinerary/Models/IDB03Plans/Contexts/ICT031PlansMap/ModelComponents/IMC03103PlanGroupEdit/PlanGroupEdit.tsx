import { QueryDocumentSnapshot, setDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { TextInputChangeEventData, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

import { PlanGroupsListInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT021';

import { ICT031PlansMap } from '../../PlansMap';

import i18n from '@/Common/Hooks/i18n-js';
import { IMC03101PlanEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03101PlanEdit';
import { IMC03102TrafficMovementEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03102TrafficMovementEdit';
import { CCO003DateTimePicker } from '@/Common/Components/CCO003DateTimePicker';

export const IMC03103PlanGroupsEdit = ({
	planGroupsDoc,
}: {
	planGroupsDoc: QueryDocumentSnapshot<PlanGroupsListInterface>;
}) => {
	const { plansCRef } = useContext(ICT031PlansMap);
	const planGroups = planGroupsDoc.data();

	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {}, []);

	let representativeFounded = false;

	return (
		<View style={{ width: '100%' }}>
			<Text>representativePlanID = {planGroups.representativePlanID}</Text>

			{/* TODO: あとで消す */}
			<View>
				<Text>representativeStartDateTime</Text>
				<CCO003DateTimePicker
					value={planGroups.representativeStartDateTime}
					onChange={(event, date) => {
						if (event.type === 'set') {
							setDoc(planGroupsDoc.ref, {
								...planGroups,
								representativeStartDateTime: date!,
								updatedAt: new Date(),
							});
						}
					}}
					mode="time"
				/>
			</View>
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
				const dependentPlanID = (() => {
					if (beforeAfterRepresentativeType === 'before') {
						return planGroups.plans[index + 1];
					}
					if (beforeAfterRepresentativeType === 'after') {
						return planGroups.plans[index - 1];
					}
					return planID;
				})();
				return (
					<View key={planID}>
						<IMC03101PlanEdit
							planID={planID}
							beforeAfterRepresentativeType={beforeAfterRepresentativeType}
							dependentPlanID={dependentPlanID}
							planGroupsDoc={planGroupsDoc}
							isPlanGroupMounted={isMounted}
						/>
						<IMC03102TrafficMovementEdit
							planID={planID}
							planGroupsDoc={planGroupsDoc}
							nextPlanID={planGroups.plans[index + 1]}
						/>
					</View>
				);
			})}
		</View>
	);
};
