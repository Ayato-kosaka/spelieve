import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setStringAsync } from 'expo-clipboard';
import React, { useContext } from 'react';
import { ScrollView, ActivityIndicator, View } from 'react-native';
import { Headline, Button } from 'react-native-paper';

import { IPA001ItineraryEditController } from './ItineraryEditController';
import { styles } from './ItineraryEditStyle';

import { BottomTabParamList } from '@/App';
import i18n from '@/Common/Hooks/i18n-js';
import { ENV } from '@/ENV';
import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';
import { IMC03103PlanGroupsEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03103PlanGroupEdit';

export const IPA001ItineraryEdit = ({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'ItineraryEdit'>) => {
	const { itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const { isPlansLoading } = useContext(ICT031PlansMap);
	const { planGroupsQSnap, createPlanGroup } = useContext(ICT021PlanGroupsList);

	IPA001ItineraryEditController({
		route,
		navigation,
	});

	if (
		!route.params.itineraryID ||
		!itineraryDocSnap ||
		!itineraryDocSnap.exists() ||
		isPlansLoading ||
		!planGroupsQSnap
	) {
		return <ActivityIndicator animating />;
	}

	let isAnotherDay = true;
	let prevDateNumber = 0;

	return (
		<ScrollView>
			{planGroupsQSnap?.docs.map((planGroupsDoc) => {
				const planGroup = planGroupsDoc.data();
				isAnotherDay = prevDateNumber !== planGroup.dayNumber;
				prevDateNumber = planGroup.dayNumber;
				return (
					<View key={planGroupsDoc.id}>
						{isAnotherDay && <Headline>{planGroup.dayNumber}日目</Headline>}
						<IMC03103PlanGroupsEdit planGroupsDoc={planGroupsDoc} />
					</View>
				);
			})}
			<Button
				mode="outlined"
				style={styles.button}
				labelStyle={{ color: 'black' }}
				onPress={() => {
					// eslint-disable-next-line @typescript-eslint/no-floating-promises
					createPlanGroup();
				}}>
				{i18n.t('Add Plan group')}
			</Button>
			<Button
				mode="outlined"
				style={styles.button}
				labelStyle={{ color: 'black' }}
				onPress={() => {
					// TODO: https://github.com/Ayato-kosaka/spelieve/issues/461 React Navigation を見直す
					// eslint-disable-next-line @typescript-eslint/no-floating-promises
					setStringAsync(`${ENV.HOST_NAME_WEB}/Itinerary/TopTab/ItineraryEdit?itineraryID=${itineraryDocSnap.id}`);
				}}>
				{i18n.t('copy Share URL')}
			</Button>
		</ScrollView>
	);
};
