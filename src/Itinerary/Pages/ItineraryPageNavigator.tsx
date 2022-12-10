import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { EditPlanPropsInterface, ItineraryCoverPropsInterface } from 'spelieve-common/lib/Interfaces';

import { ICT011ItineraryOneProvider } from '../Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsListProvider } from '../Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMapProvider } from '../Models/IDB03Plans/Contexts/ICT031PlansMap';
import { INV002ItineraryTopTabNavigator, TopTabParamList } from '../Navigator/INV002ItineraryTopTabNavigator';

import { IPA002ItineraryCover } from './IPA002ItineraryCover';
import { IPA003EditPlan } from './IPA003EditPlan';

import i18n from '@/Common/Hooks/i18n-js';
import { CPA001HelloSpelieve } from '@/Common/Pages/CPA001HelloSpelieve/HelloSpelieve';
import { PCT012MPlaceOneProvider } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne';

export type ItineraryStackParamList = {
	IPA002ItineraryCover: ItineraryCoverPropsInterface;
	ItineraryTopTabNavigator: NavigatorScreenParams<TopTabParamList>;
	IPA003EditPlan: EditPlanPropsInterface;
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
							name="ItineraryTopTabNavigator"
							component={INV002ItineraryTopTabNavigator}
							initialParams={{}}
							options={{ title: 'TopTabNavigator' }}
						/>
						<Stack.Screen
							name="IPA002ItineraryCover"
							component={IPA002ItineraryCover}
							initialParams={{}}
							options={{ title: i18n.t('しおり設定') }}
						/>
						<Stack.Screen
							name="IPA003EditPlan"
							component={IPA003EditPlan}
							initialParams={{}}
							options={{ title: i18n.t('予定の設定') }}
						/>
						<Stack.Screen
							name="HelloSpelieve"
							component={CPA001HelloSpelieve}
							initialParams={{}}
							options={{ headerShown: false }}
						/>
					</Stack.Navigator>
				</PCT012MPlaceOneProvider>
			</ICT021PlanGroupsListProvider>
		</ICT031PlansMapProvider>
	</ICT011ItineraryOneProvider>
);
