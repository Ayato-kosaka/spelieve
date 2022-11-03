import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

import { PlacesPropsInterface, PlacePropsInterface } from 'spelieve-common/lib/Interfaces';

import { PCT012MPlaceOneProvider } from '../Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';

import { PPA001Places } from './PPA001Places';
import { PPA002Place } from './PPA002Place/Place';

import { BottomTabParamList } from '@/App';
import { PCT011MPlacesListProvider } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';

export type PlaceStackParamList = {
	PPA001Places: PlacesPropsInterface; // 本来は PagePropsInterface を設定する
	PPA002Place: PlacePropsInterface; // 本来は PagePropsInterface を設定する
};

const Stack = createNativeStackNavigator<PlaceStackParamList>();

export const PlacePageNavigator = ({ navigation }: NativeStackScreenProps<BottomTabParamList, 'Place'>) => (
	<PCT012MPlaceOneProvider parentDocRef={undefined} initialPlaceId="" language="ja">
		<PCT011MPlacesListProvider
			parentDocRef={undefined}
			initialCountry="日本"
			initialAdministrativeAreaLevel1=""
			initialAdministrativeAreaLevel2=""
			initialLocality="">
			<Stack.Navigator initialRouteName="PPA001Places">
				<Stack.Screen
					name="PPA001Places"
					component={PPA001Places}
					initialParams={{ country: '', administrativeAreaLevel1: '', administrativeAreaLevel2: '', locality: '' }}
				/>
				<Stack.Screen name="PPA002Place" component={PPA002Place} initialParams={{ place_id: '', language: '' }} />
			</Stack.Navigator>
		</PCT011MPlacesListProvider>
	</PCT012MPlaceOneProvider>
);
