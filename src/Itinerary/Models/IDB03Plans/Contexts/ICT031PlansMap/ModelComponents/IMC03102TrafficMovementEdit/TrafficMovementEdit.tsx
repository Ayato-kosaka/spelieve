import { useContext, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TrafficMovementEditPropsInterface } from 'spelieve-common/lib/Interfaces';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import { IMC03102TrafficMovementEditController } from './TrafficMovementEditController';

import i18n from '@/Common/Hooks/i18n-js';
import { IMC03104EditDirectionsMode } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03104EditDirectionsMode';
import { travelModeConverter } from '@/Place/Hooks/PHK001GooglePlaceAPI';
import { materialColors } from '@/ThemeProvider';

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
		<>
			<View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 4 }}>
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					{plan.place_id && nextPlan?.place_id && (
						<Pressable
							onPress={() => {
								setBottomSheetVisible(true);
							}}>
							<MaterialCommunityIcons
								name={
									plan.transportationMode
										? travelModeConverter[plan.transportationMode].iconName
										: 'checkbox-blank-circle'
								}
								size={20}
							/>
						</Pressable>
					)}
				</View>
				<View style={{ flex: 14, flexDirection: 'row' }}>
					<View style={{ flex: 3 }}>
						{plan.place_id && nextPlan?.place_id && (
							<View>
								<Text>
									{plan.transportationDepartureTime
										? `${DateUtils.formatToHHMM(plan.transportationDepartureTime)} ~`
										: ''}
								</Text>
								<Text>
									{plan.transportationArrivalTime ? `${DateUtils.formatToHHMM(plan.transportationArrivalTime)}` : ''}
								</Text>
							</View>
						)}
					</View>
					<View style={{ flex: 11, flexDirection: 'row' }}>
						<Button
							mode="outlined"
							icon="plus"
							onPress={() => {
								// eslint-disable-next-line @typescript-eslint/no-floating-promises
								addPlan();
							}}
							color={materialColors.grey['500']}
							style={{ backgroundColor: 'white' }}>
							{i18n.t('Add Plan')}
						</Button>
					</View>
				</View>
			</View>
			<IMC03104EditDirectionsMode
				planID={planID}
				bottomSheetVisible={bottomSheetVisible}
				setBottomSheetVisible={setBottomSheetVisible}
			/>
		</>
	);
};
