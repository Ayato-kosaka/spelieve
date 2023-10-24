import { useMemo } from 'react';
import { View } from 'react-native';
import { Card, Button } from 'react-native-paper';

import { IMC03103PlanGroupsEditController } from './PlanGroupsEditController';
import { PlanGroupsEditPropsInterface } from './PlanGroupsEditPropsInterface';

import i18n from '@/Common/Hooks/i18n-js';
import { IMC03101PlanEdit } from '@/Itinerary/Contexts/ICT031PlansMap/ModelComponents/IMC03101PlanEdit';
import { IMC03102TrafficMovementEdit } from '@/Itinerary/Contexts/ICT031PlansMap/ModelComponents/IMC03102TrafficMovementEdit/TrafficMovementEdit';
import { IMC03102TrafficMovementEditTemplate } from '@/Itinerary/Contexts/ICT031PlansMap/ModelComponents/IMC03102TrafficMovementEdit/TrafficMovementEditTemplate';
import { materialColors, primaryColorNm } from '@/ThemeProvider';

export const IMC03103PlanGroupsEdit = ({ planGroupsDoc, onPlanPress }: PlanGroupsEditPropsInterface) => {
	const planGroups = useMemo(() => planGroupsDoc.data(), [planGroupsDoc]);

	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/343 itinerary Plan のドラッグアンドドロップ

	const { isMounted, addFirstPlan, draxItemList } = IMC03103PlanGroupsEditController({ planGroupsDoc });

	return (
		<Card
			style={{ marginVertical: '2%', marginHorizontal: '1%', backgroundColor: materialColors[primaryColorNm]['50'] }}>
			<Card.Content>
				{/* 先頭の Plan 追加ボタン */}
				<IMC03102TrafficMovementEditTemplate
					Mode={undefined}
					Time={undefined}
					AddPlan={
						<Button
							mode="outlined"
							icon="plus"
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onPress={addFirstPlan}
							color={materialColors.grey['500']}
							style={{ backgroundColor: 'white' }}>
							{i18n.t('Add Plan')}
						</Button>
					}
				/>
				{draxItemList.map(({ planID, index, beforeAfterRepresentativeType, dependentPlanID }) => (
					<View key={planID}>
						<IMC03101PlanEdit
							planID={planID}
							beforeAfterRepresentativeType={beforeAfterRepresentativeType}
							dependentPlanID={dependentPlanID}
							planGroupsDoc={planGroupsDoc}
							isPlanGroupMounted={isMounted}
							planIndex={index}
							onPlanPress={onPlanPress}
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
