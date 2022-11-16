import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, View } from 'react-native';
import { Title } from 'react-native-paper';

import { BottomTabParamList } from '@/App';

export const PPA000DummyPage = ({ navigation }: NativeStackScreenProps<BottomTabParamList>) => (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Title>Dummy Place Page</Title>
			<Button
				title="Go to DummyPage2"
				onPress={() =>
					navigation.navigate('Place', {
						screen: 'DummyPage2',
						params: {},
					})
				}
			/>
		</View>
	)
