import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

import i18n from '../Hooks/i18n-js';
import { RootStackScreenProps } from '../Navigation/NavigationInterface';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	link: {
		marginTop: 15,
		paddingVertical: 15,
	},
	linkText: {
		fontSize: 14,
		color: '#2e78b7',
	},
});

export const NotFoundScreen = ({ navigation }: RootStackScreenProps<'NotFound'>) => (
	<View style={styles.container}>
		<Text style={styles.title}>{i18n.t("This screen doesn't exist.")}</Text>
		<TouchableOpacity
			onPress={() =>
				navigation.navigate('BottomTabNavigator', {
					screen: 'Itinerary',
					params: { screen: 'HelloSpelieve', params: {} },
				})
			}
			style={styles.link}>
			<Text style={styles.linkText}>{i18n.t('Go to home screen!')}</Text>
		</TouchableOpacity>
	</View>
);
