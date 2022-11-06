import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ItineraryCoverPropsInterface, ItineraryEditPropsInterface } from 'spelieve-common/lib/Interfaces';

import { ICT011ItineraryOneProvider } from '../Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsListProvider } from '../Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMapProvider } from '../Models/IDB03Plans/Contexts/ICT031PlansMap';

import { IPA001ItineraryEdit } from './IPA001ItineraryEdit';
import { IPA002ItineraryCover } from './IPA002ItineraryCover';

import i18n from '@/Common/Hooks/i18n-js';

export type ItineraryStackParamList = {
	IPA001ItineraryEdit: ItineraryEditPropsInterface;
	IPA002ItineraryCover: ItineraryCoverPropsInterface;
};

const Stack = createNativeStackNavigator<ItineraryStackParamList>();

export function ItineraryPageNavigator() {
	return (
		<ICT011ItineraryOneProvider>
			<ICT031PlansMapProvider>
				<ICT021PlanGroupsListProvider>
					{/* TODO: PCT012MPlaceOneProvider を設定する */}
					<Stack.Navigator initialRouteName="IPA001ItineraryEdit">
						<Stack.Screen
							name="IPA001ItineraryEdit"
							component={IPA001ItineraryEdit}
							initialParams={{}}
							options={{ title: '' }}
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
}
