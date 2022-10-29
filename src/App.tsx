import { StatusBar } from 'expo-status-bar';
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import { ICT011ItineraryOneProvider } from './Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';

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

export default function App() {
	return (
		<PaperProvider>
			<ICT011ItineraryOneProvider>
				<View style={styles.container}>
					<Text>Open up App.tsx to start working on your app!</Text>
					<StatusBar style="auto" />
					<IPA001Itinerary />
				</View>
			</ICT011ItineraryOneProvider>
		</PaperProvider>
	);
}

registerRootComponent(App);
