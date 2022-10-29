import { StatusBar } from 'expo-status-bar';
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import { ICT011ItineraryOneProvider } from './Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsListProvider } from './Itinerary/Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMapProvider } from './Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';

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
				<ICT031PlansMapProvider>
					<ICT021PlanGroupsListProvider>
						<View style={styles.container}>
							<Text>Open up App.tsx to start working on your app!</Text>
							<StatusBar style="auto" />
							<IPA001Itinerary />
						</View>
					</ICT021PlanGroupsListProvider>
				</ICT031PlansMapProvider>
			</ICT011ItineraryOneProvider>
		</PaperProvider>
	);
}

registerRootComponent(App);
