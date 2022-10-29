import { StatusBar } from 'expo-status-bar';
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import { CCT002ModalProvider } from './Common/Context/CCT002Modal';

import { IPA001Itinerary } from '@/Itinerary/Pages/IPA001Itinerary';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		width: '100%',
		maxWidth: '450px',
		marginHorizontal: 'auto',
	},
});

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<PaperProvider>
		<View style={styles.container}>
			<CCT002ModalProvider>
					<Text>Open up App.tsx to start working on your app!</Text>
					<StatusBar style="auto" />
					<IPA001Itinerary />
			</CCT002ModalProvider>
				</View>
		</PaperProvider>
	);
}

registerRootComponent(App);
