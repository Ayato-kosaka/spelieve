import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { EditPlanPropsInterface, ItineraryCoverPropsInterface } from 'spelieve-common/lib/Interfaces';

import { ICT011ItineraryOneProvider } from '../Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsListProvider } from '../Contexts/ICT021PlanGroupsList';
import { ICT031PlansMapProvider } from '../Contexts/ICT031PlansMap';
import { INV002ItineraryTopTabNavigator, TopTabParamList } from '../Navigator/INV002ItineraryTopTabNavigator';

import { IPA002ItineraryCover } from './IPA002ItineraryCover';
import { IPA003EditPlan } from './IPA003EditPlan';

import i18n from '@/Common/Hooks/i18n-js';
import { PCT012MPlaceOneProvider } from '@/Place/Contexts/PCT012MPlaceOne';
import { ThumbnailEditorEntory } from '@/Thumbnail/Pages/TPA001ThumbnailEditor/ThumbnailEditor';

export type ItineraryStackParamList = {
	ItineraryCover: ItineraryCoverPropsInterface;
	TopTab: NavigatorScreenParams<TopTabParamList>;
	EditPlan: EditPlanPropsInterface;
	HelloSpelieve: Record<string, never>;
} & TopTabParamList;

const Stack = createNativeStackNavigator<ItineraryStackParamList>();

export const ItineraryPageNavigator = () => (
	<ICT011ItineraryOneProvider>
		<ICT031PlansMapProvider>
			<ICT021PlanGroupsListProvider>
				<PCT012MPlaceOneProvider>
					<Stack.Navigator initialRouteName="HelloSpelieve">
						<Stack.Screen
							name="TopTab"
							component={INV002ItineraryTopTabNavigator}
							initialParams={{}}
							options={{ title: '' }}
						/>
						<Stack.Screen
							name="ItineraryCover"
							component={IPA002ItineraryCover}
							initialParams={{}}
							options={{ title: i18n.t('Itinerary setting') }}
						/>
						<Stack.Screen
							name="EditPlan"
							component={IPA003EditPlan}
							initialParams={{}}
							options={{ title: i18n.t('Plan setting') }}
						/>
						<Stack.Screen
							name="HelloSpelieve"
							component={ThumbnailEditorEntory}
							initialParams={{}}
							options={{ headerShown: false }}
						/>
					</Stack.Navigator>
				</PCT012MPlaceOneProvider>
			</ICT021PlanGroupsListProvider>
		</ICT031PlansMapProvider>
	</ICT011ItineraryOneProvider>
);
