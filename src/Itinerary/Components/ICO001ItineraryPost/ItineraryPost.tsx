import { Image, View, ScrollView } from 'react-native';
import { Card, Subheading, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { ItineraryOneInterface, PlanGroupsListInterface, PlansMapInterface } from 'spelieve-common/lib/Interfaces';

import { styles } from './ItineraryPostStyle';

import { travelModeConverter } from '@/Place/Hooks/PHK001GooglePlaceAPI';

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
					<Subheading style={styles.itinerarySubTitle}>{itinerary.subTitle}</Subheading>
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
													{plan.placeStartTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}~
													{plan.placeEndTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
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
															{plan.transportationSpan.toLocaleTimeString(undefined, {
																hour: '2-digit',
																minute: '2-digit',
															})}
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
