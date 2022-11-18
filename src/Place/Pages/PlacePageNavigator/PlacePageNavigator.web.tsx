import { LoadScript } from '@react-google-maps/api';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

import { PlacePropsInterface, PlacesPropsInterface } from 'spelieve-common/lib/Interfaces';

import { PCT012MPlaceOneProvider } from '../../Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';
import { PPA001Places } from '../PPA001Places';
import { PPA002Place } from '../PPA002Place/Place';

import { PlaceStackParamList } from './PlacePageNavigator';

import { BottomTabParamList } from '@/App';
import { ENV } from '@/ENV';
import { PCT011MPlacesListProvider } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';

export type PlaceStackParamList = {
	PPA001Places: PlacesPropsInterface; // 本来は PagePropsInterface を設定する
	PPA002Place: PlacePropsInterface; // 本来は PagePropsInterface を設定する
};

const Stack = createNativeStackNavigator<PlaceStackParamList>();

export const PlacePageNavigator = ({ navigation }: NativeStackScreenProps<BottomTabParamList, 'Place'>) => (
	<PCT012MPlaceOneProvider>
		<PCT011MPlacesListProvider>
			<LoadScript googleMapsApiKey={ENV.GCP_API_KEY}>
				<Stack.Navigator initialRouteName="PPA001Places">
					<Stack.Screen name="PPA001Places" component={PPA001Places} initialParams={{}} />
					<Stack.Screen name="PPA002Place" component={PPA002Place} initialParams={{}} />
				</Stack.Navigator>
			</LoadScript>
		</PCT011MPlacesListProvider>
	</PCT012MPlaceOneProvider>
);
