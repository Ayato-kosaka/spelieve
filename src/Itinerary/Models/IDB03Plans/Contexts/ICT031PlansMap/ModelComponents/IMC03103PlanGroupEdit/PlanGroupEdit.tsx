import { QueryDocumentSnapshot, setDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { PlanGroupsListInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT021';

import { ICT031PlansMap } from '../../PlansMap';

import { CCO003DateTimePicker } from '@/Common/Components/CCO003DateTimePicker';
import { IMC03101PlanEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03101PlanEdit';
import { IMC03102TrafficMovementEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03102TrafficMovementEdit';

export const IMC03103PlanGroupsEdit = ({
	planGroupsDoc,
}: {
	planGroupsDoc: QueryDocumentSnapshot<PlanGroupsListInterface>;
}) => {
	const { plansCRef } = useContext(ICT031PlansMap);
	const planGroups = planGroupsDoc.data();

	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/343 itinerary Plan のドラッグアンドドロップ

	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

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
							// eslint-disable-next-line @typescript-eslint/no-floating-promises
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
							beforeAfterRepresentativeType={beforeAfterRepresentativeType}
							dependentPlanID={dependentPlanID}
							planGroupsDoc={planGroupsDoc}
							nextPlanID={planGroups.plans[index + 1]}
							isPlanGroupMounted={isMounted}
						/>
					</View>
				);
			})}
		</View>
	);
};
