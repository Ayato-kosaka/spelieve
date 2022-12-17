import { QueryDocumentSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { PlanGroupsListInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT021';

import { IMC03101PlanEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03101PlanEdit';
import { IMC03102TrafficMovementEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03102TrafficMovementEdit';

export const IMC03103PlanGroupsEdit = ({
	planGroupsDoc,
}: {
	planGroupsDoc: QueryDocumentSnapshot<PlanGroupsListInterface>;
}) => {
	const planGroups = planGroupsDoc.data();

	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/343 itinerary Plan のドラッグアンドドロップ

	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	let representativeFounded = false;

	return (
		<View style={{ width: '100%' }}>
			<Text>{planGroups.representativeStartDateTime.toString()}</Text>
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
