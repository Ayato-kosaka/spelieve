import { QueryDocumentSnapshot } from 'firebase/firestore';
import { View } from 'react-native';
import { Card } from 'react-native-paper';

import { PlanGroupsListInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT021';

import { IMC03103PlanGroupsEditController } from './PlanGroupsEditController';

import { IMC03101PlanEdit } from '@/Itinerary/Contexts/ICT031PlansMap/ModelComponents/IMC03101PlanEdit';
import { IMC03102TrafficMovementEdit } from '@/Itinerary/Contexts/ICT031PlansMap/ModelComponents/IMC03102TrafficMovementEdit';
import { materialColors, primaryColorNm } from '@/ThemeProvider';

export const IMC03103PlanGroupsEdit = ({
	planGroupsDoc,
}: {
	planGroupsDoc: QueryDocumentSnapshot<PlanGroupsListInterface>;
}) => {
	const planGroups = planGroupsDoc.data();

	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/343 itinerary Plan のドラッグアンドドロップ

	const { isMounted, draxItemList } = IMC03103PlanGroupsEditController({ planGroupsDoc });

	return (
		<Card
			style={{ marginVertical: '2%', marginHorizontal: '1%', backgroundColor: materialColors[primaryColorNm]['50'] }}>
			<Card.Content>
				{draxItemList.map(({ planID, index, beforeAfterRepresentativeType, dependentPlanID }) => (
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
				))}
			</Card.Content>
		</Card>
	);
};
