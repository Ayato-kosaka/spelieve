import { useContext, useMemo } from 'react';
import { Button, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TrafficMovementEditPropsInterface } from 'spelieve-common/lib/Interfaces';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import { IMC03102TrafficMovementEditController } from './TrafficMovementEditController';

import i18n from '@/Common/Hooks/i18n-js';
import { IMC03104EditDirectionsMode } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03104EditDirectionsMode';
import { travelModeConverter } from '@/Place/Hooks/PHK001GooglePlaceAPI';

export const IMC03102TrafficMovementEdit = ({
	planID,
	beforeAfterRepresentativeType,
	planGroupsDoc,
	dependentPlanID,
	isPlanGroupMounted,
	nextPlanID,
}: TrafficMovementEditPropsInterface) => {
	const { plansDocSnapMap } = useContext(ICT031PlansMap);
	const planDocSnap = useMemo(() => plansDocSnapMap[planID], [planID, plansDocSnapMap]);
	const plan = useMemo(() => planDocSnap.data(), [planDocSnap]);
	const nextPlan = useMemo(
		() => (nextPlanID ? plansDocSnapMap[nextPlanID].data() : undefined),
		[nextPlanID, plansDocSnapMap],
	);

	const { addPlan, bottomSheetVisible, setBottomSheetVisible } = IMC03102TrafficMovementEditController({
		planID,
		beforeAfterRepresentativeType,
		planGroupsDoc,
		dependentPlanID,
		isPlanGroupMounted,
		nextPlanID,
	});

	return (
		<View style={{ borderWidth: 1 }}>
			{plan.place_id && nextPlan?.place_id && (
				<View>
					<Pressable
						onPress={() => {
							setBottomSheetVisible(true);
						}}>
						{plan.transportationMode ? (
							<MaterialCommunityIcons name={travelModeConverter[plan.transportationMode].iconName} />
						) : (
							<MaterialCommunityIcons name="checkbox-blank-circle" />
						)}
					</Pressable>
					<Text>
						{plan.transportationDepartureTime ? DateUtils.formatToHHMM(plan.transportationDepartureTime) : ''}
					</Text>
					<Text>~</Text>
					<Text>{plan.transportationArrivalTime ? DateUtils.formatToHHMM(plan.transportationArrivalTime) : ''}</Text>
				</View>
			)}
			<Button
				title={i18n.t('予定を追加')}
				onPress={() => {
					// eslint-disable-next-line @typescript-eslint/no-floating-promises
					addPlan();
				}}
			/>
			<IMC03104EditDirectionsMode
				planID={planID}
				bottomSheetVisible={bottomSheetVisible}
				setBottomSheetVisible={setBottomSheetVisible}
			/>
		</View>
	);
};
