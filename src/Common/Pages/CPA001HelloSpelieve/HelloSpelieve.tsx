import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, View } from 'react-native';

import { BottomTabParamList } from '@/App';
import { CCO006ImagePicker } from '@/Common/Components/CCO006ImagePicker/ImagePicker';

export const CPA001HelloSpelieve = ({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'HelloSpelieve'>) => (
	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/156 LP作成計画検討
	<View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
		<View>
			<CCO006ImagePicker />
			<Button
				title="新しく始める"
				onPress={() =>
					navigation.navigate('Itinerary', {
						screen: 'ItineraryTopTabNavigator',
						params: {
							screen: 'IPA001ItineraryEdit',
							params: {},
						},
					})
				}
			/>
			<Button
				title="開発者用 Itinerary で始める"
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
	</View>
);
