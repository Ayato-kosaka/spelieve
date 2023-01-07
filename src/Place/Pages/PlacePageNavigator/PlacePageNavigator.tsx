import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

import { PlacePropsInterface, PlacesPropsInterface } from 'spelieve-common/lib/Interfaces';

import { PCT012MPlaceOneProvider } from '../../Contexts/PCT012MPlaceOne/MPlaceOne';
import { PPA001Places } from '../PPA001Places';
import { PPA002Place } from '../PPA002Place/Place';

import { BottomTabParamList } from '@/App';
import { PCT011MPlacesListProvider } from '@/Place/Contexts/PCT011MPlacesList';

export type PlaceStackParamList = {
	PPA001Places: PlacesPropsInterface;
	PPA002Place: PlacePropsInterface;
};

const Stack = createNativeStackNavigator<PlaceStackParamList>();

export const PlacePageNavigator = ({ navigation }: NativeStackScreenProps<BottomTabParamList, 'Place'>) => (
	<PCT012MPlaceOneProvider>
		<PCT011MPlacesListProvider>
			<Stack.Navigator initialRouteName="PPA001Places" screenOptions={{ headerShown: false }}>
				<Stack.Screen name="PPA001Places" component={PPA001Places} initialParams={{}} />
				<Stack.Screen name="PPA002Place" component={PPA002Place} initialParams={{}} />
			</Stack.Navigator>
		</PCT011MPlacesListProvider>
	</PCT012MPlaceOneProvider>
);
