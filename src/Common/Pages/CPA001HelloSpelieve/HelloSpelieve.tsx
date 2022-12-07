import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, View } from 'react-native';
import { Text } from 'react-native-paper';

import { BottomTabParamList } from '@/App';

export const CPA001HelloSpelieve = ({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'HelloSpelieve'>) => (
	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/156 LP作成計画検討
	<View>
		<Text style={{marginTop: '90%'}}>よはく</Text>
		<Button
			
			title="始める"
			onPress={() =>
				navigation.navigate('Itinerary', {
					screen: 'ItineraryTopTabNavigator',
					params: {
						screen: 'IPA001ItineraryEdit',
						params: {
							itineraryID: 'uMFhF6OQph2UUuKEsKNa',
						},
					},
				})
			}
		/>
	</View>
);
