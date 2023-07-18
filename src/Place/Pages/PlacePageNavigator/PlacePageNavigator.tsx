import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PCT012MPlaceOneProvider } from '../../Contexts/PCT012MPlaceOne/MPlaceOne';
import { PPA001Places } from '../PPA001Places';
import { PPA002Place } from '../PPA002Place/Place';

import { PlaceStackParamList } from '@/Common/Navigation/NavigationInterface';
import { PCT011MPlacesListProvider } from '@/Place/Contexts/PCT011MPlacesList';

const Stack = createNativeStackNavigator<PlaceStackParamList>();

export const PlacePageNavigator = () => (
	<PCT012MPlaceOneProvider>
		<PCT011MPlacesListProvider>
			<Stack.Navigator initialRouteName="PPA001Places" screenOptions={{ headerShown: false }}>
				<Stack.Screen name="PPA001Places" component={PPA001Places} initialParams={{}} />
				<Stack.Screen name="PPA002Place" component={PPA002Place} initialParams={{}} />
			</Stack.Navigator>
		</PCT011MPlacesListProvider>
	</PCT012MPlaceOneProvider>
);
