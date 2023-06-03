import { Image, View, ScrollView } from 'react-native';
import { Card, Subheading, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { styles } from './ItineraryPostStyle';

import { ItineraryOneInterface } from '@/Itinerary/Contexts/ICT011ItineraryOne/ItineraryOneIntereface';
import { PlanGroupsListInterface } from '@/Itinerary/Contexts/ICT021PlanGroupsList/PlanGroupsListInterface';
import { PlansMapInterface } from '@/Itinerary/Contexts/ICT031PlansMap/PlansMapInterface';
import { travelModeConverter } from '@/Place/Hooks/PHK001GooglePlaceAPI';
import { dateToHourMinString } from '@/Common/Hooks/CHK007DateUtils';

interface ItineraryPostPropsInterface {
	itinerary: ItineraryOneInterface;
	planGroups: PlanGroupsListInterface[];
	plans: { [id: string]: PlansMapInterface };
}

export const ICO001ItineraryPost = ({ itinerary, planGroups, plans }: ItineraryPostPropsInterface) => {
	let isAnotherDay = true;
	let prevDateNumber = 0;
	return (
		<ScrollView>
			<Card>
				<Image source={{ uri: itinerary.imageUrl }} resizeMode="cover" style={styles.itinerayImage} />
				<Card.Content>
					<Text style={styles.itineraryCaption}>{itinerary.caption}</Text>
					{planGroups.map((planGroup) => {
						isAnotherDay = prevDateNumber !== planGroup.dayNumber;
						prevDateNumber = planGroup.dayNumber;
						return (
							<View key={planGroup.representativePlanID}>
								{isAnotherDay && <Subheading>{planGroup.dayNumber}日目</Subheading>}
								{planGroup.plans.map((planId) => {
									const plan = plans[planId];
									return (
										<View key={planId}>
											<View>
												<Image source={{ uri: plan.imageUrl }} style={styles.planImage} />
												{plan.title !== '' && <Text style={styles.planTitle}>{plan.title}</Text>}
												<Text style={styles.planTime}>
													{dateToHourMinString(plan.placeStartTime)}~
													{dateToHourMinString(plan.placeEndTime)}
												</Text>
											</View>
											<View style={styles.transportationSpanContainer}>
												<View style={styles.transportationSpanLeft} />
												{plan.transportationMode && (
													<View style={styles.transportationSpanRight}>
														<MaterialCommunityIcons
															name={travelModeConverter[plan.transportationMode].iconName}
															size={20}
														/>
														<Text>
															{dateToHourMinString(plan.transportationSpan)}
														</Text>
													</View>
												)}
											</View>
										</View>
									);
								})}
							</View>
						);
					})}
				</Card.Content>
			</Card>
		</ScrollView>
	);
};
