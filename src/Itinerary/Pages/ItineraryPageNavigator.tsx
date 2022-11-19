import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ItineraryCoverPropsInterface, ItineraryTopTabNavigatorPropsInterface } from 'spelieve-common/lib/Interfaces';

import { ICT011ItineraryOneProvider } from '../Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsListProvider } from '../Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMapProvider } from '../Models/IDB03Plans/Contexts/ICT031PlansMap';
import { TopTabNavigator, TopTabParamList } from '../Navigator/INV002ItineraryTopTabNavigator';

import { IPA002ItineraryCover } from './IPA002ItineraryCover';

import i18n from '@/Common/Hooks/i18n-js';

export type ItineraryStackParamList = {
	IPA002ItineraryCover: ItineraryCoverPropsInterface;
	TopTabNavigator: ItineraryTopTabNavigatorPropsInterface;
} & TopTabParamList;

const Stack = createNativeStackNavigator<ItineraryStackParamList>();

export const ItineraryPageNavigator = () => (
	<ICT011ItineraryOneProvider>
		<ICT031PlansMapProvider>
			<ICT021PlanGroupsListProvider>
				{/* TODO: PCT012MPlaceOneProvider を設定する */}
				<Stack.Navigator initialRouteName="TopTabNavigator">
					<Stack.Screen
						name="TopTabNavigator"
						component={TopTabNavigator}
						initialParams={{}}
						options={{ title: 'TopTabNavigator' }}
					/>
					<Stack.Screen
						name="IPA002ItineraryCover"
						component={IPA002ItineraryCover}
						initialParams={{}}
						options={{ title: i18n.t('しおり設定') }}
					/>
				</Stack.Navigator>
			</ICT021PlanGroupsListProvider>
		</ICT031PlansMapProvider>
	</ICT011ItineraryOneProvider>
);
