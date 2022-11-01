import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Button } from 'react-native';
import { Title } from 'react-native-paper';

import { BottomTabParamList } from '@/App';

export function PPA000DummyPage2({ navigation }: NativeStackScreenProps<BottomTabParamList>) {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Title>Dummy Place Page 2</Title>
			<Button
				title="Go to Test"
				onPress={() =>
					navigation.navigate('Itinerary', {
						screen: 'Test',
						params: { name: 'from Dummy Page2' },
					})
				}
			/>
		</View>
	);
}
