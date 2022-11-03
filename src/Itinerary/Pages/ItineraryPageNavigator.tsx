import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ItineraryEditPropsInterface } from 'spelieve-common/lib/Interfaces';

import { ICT011ItineraryOneProvider } from '../Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsListProvider } from '../Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMapProvider } from '../Models/IDB03Plans/Contexts/ICT031PlansMap';

import { IPA001ItineraryEdit } from './IPA001ItineraryEdit';

export type ItineraryStackParamList = {
	IPA001ItineraryEdit: ItineraryEditPropsInterface;
};

const Stack = createNativeStackNavigator<ItineraryStackParamList>();

export function ItineraryPageNavigator() {
	return (
		<ICT011ItineraryOneProvider>
			<ICT031PlansMapProvider>
				<ICT021PlanGroupsListProvider>
					<Stack.Navigator initialRouteName="IPA001ItineraryEdit">
						<Stack.Screen name="IPA001ItineraryEdit" component={IPA001ItineraryEdit} initialParams={{}} />
					</Stack.Navigator>
				</ICT021PlanGroupsListProvider>
			</ICT031PlansMapProvider>
		</ICT011ItineraryOneProvider>
	);
}
