import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import i18n from '../Hooks/i18n-js';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
});

export const ModalScreen = () => (
	<View style={styles.container}>
		<Text style={styles.title}>{i18n.t('Modal')}</Text>
		<View style={styles.separator} />
		{/* <EditScreenInfo path="/screens/ModalScreen.tsx" /> */}

		{/* Use a light status bar on iOS to account for the black space above the modal */}
		<StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
	</View>
);
