import { Image, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { ItineraryOneInterface, PlanGroupsListInterface, PlansMapInterface } from 'spelieve-common/lib/Interfaces';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { travelModeConverter } from '@/Place/Hooks/PHK001GooglePlaceAPI';

interface ItineraryPostPropsInterface {
	itinerary: ItineraryOneInterface;
	planGroups: PlanGroupsListInterface[];
	plans: { [id: string]: PlansMapInterface };
}

export const ICO001ItineraryPost = ({ itinerary, planGroups, plans }: ItineraryPostPropsInterface) => (
	<ScrollView>
		<Image
			source={{ uri: itinerary.imageUrl }}
			style={{
				height: 100,
				width: 100,
			}}
		/>
		{planGroups.map((planGroup) =>
			planGroup.plans.map((planId) => {
				const plan = plans[planId];
				return (
					<View key={planId}>
						<Image
							source={{ uri: plan.imageUrl }}
							style={{
								height: 50,
								width: 100,
							}}
						/>
						{plan.transportationMode && plan.transportationDepartureTime && (
							<View>
								<MaterialCommunityIcons name={travelModeConverter[plan.transportationMode].iconName} />
								<Text>
									{plan.transportationDepartureTime ? DateUtils.formatToHHMM(plan.transportationDepartureTime) : ''}
								</Text>
								<Text>~</Text>
								<Text>
									{plan.transportationArrivalTime ? DateUtils.formatToHHMM(plan.transportationArrivalTime) : ''}
								</Text>
							</View>
						)}
					</View>
				);
			}),
		)}
	</ScrollView>
);
