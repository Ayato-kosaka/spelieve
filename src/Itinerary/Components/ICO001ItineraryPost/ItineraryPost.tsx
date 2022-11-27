import { useContext } from 'react';
import { FlatList, Image, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { ItineraryOneInterface, PlanGroupsListInterface, PlansMapInterface } from 'spelieve-common/lib/Interfaces';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';

interface ItineraryPostPropsInterface {
	itinerary: ItineraryOneInterface;
	planGroups: PlanGroupsListInterface[];
	plans: { [id: string]: PlansMapInterface };
}

export const ICO001ItineraryPost = ({ itinerary, planGroups, plans }: ItineraryPostPropsInterface) => {
	const { travelModeConverter } = useContext(ICT031PlansMap);
	return (
		<View>
			<Image
				source={{ uri: itinerary.imageUrl }}
				style={{
					height: '100vw',
					width: '100vw',
				}}
			/>
			<FlatList
				data={planGroups}
				renderItem={(planGroupItemInfo) => (
					<FlatList
						data={planGroupItemInfo.item.plans}
						renderItem={(planIDItemInfo) => {
							const plan = plans[planIDItemInfo.item];
							return (
								<View>
									<Image
										source={{ uri: plan.imageUrl }}
										style={{
											height: '50vw',
											width: '100vw',
										}}
									/>
									{plan.transportationMode && plan.transportationDepartureTime && (
										<View>
											<MaterialCommunityIcons name={travelModeConverter[plan.transportationMode].iconName} />
											<Text>
												{plan.transportationDepartureTime
													? DateUtils.formatToHHMM(plan.transportationDepartureTime)
													: ''}
											</Text>
											<Text>~</Text>
											<Text>
												{plan.transportationArrivalTime ? DateUtils.formatToHHMM(plan.transportationArrivalTime) : ''}
											</Text>
										</View>
									)}
								</View>
							);
						}}
					/>
				)}
			/>
		</View>
	);
};
