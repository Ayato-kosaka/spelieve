import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, View } from 'react-native';

import { BottomTabParamList } from '@/App';

export const CPA001HelloSpelieve = ({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'HelloSpelieve'>) => (
	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/156 LP作成計画検討
	<View>
		<Button
			title="始める"
			onPress={() =>
				// TODO: https://github.com/Ayato-kosaka/spelieve/issues/360 navigation.push を利用する
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
