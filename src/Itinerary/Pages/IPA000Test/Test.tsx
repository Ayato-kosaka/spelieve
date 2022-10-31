import { BottomTabParamList } from '@/App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Button, View } from 'react-native';
import { Title } from 'react-native-paper';
import { ItineraryStackParamList } from '../ItineraryPageNavigator';

export function IPA000Test({navigation}: NativeStackScreenProps<BottomTabParamList, 'Itinerary', 'Test'>) {
	// const [itinerary, setItinerary] = useState<DocumentSnapshot>();
	// console.log(process.env);

	// useEffect(() => {
	// 	const fetch = async () => {
	// 		const documentSnapshot = await getDoc(doc(collection(db, 'Itineraries'), 'nzEQO5MhckDefM4MsAC7'));
	// 		setItinerary(documentSnapshot);
	// 	};
	// 	fetch();
	// }, []);

	// if (!itinerary) {
	// 	return <ActivityIndicator animating />;
	// }

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Title>Itinerary</Title>
			{/* <Text>{JSON.stringify(itinerary.data())}</Text> */}
      <Button
        title="Go to DummyPage"
        onPress={() =>
          navigation.navigate('Place', {
            screen: 'DummyPage',
            params: {},
          })
        }
      />
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
		// <ICT003PlansProvider
		//   parentDocRef={itinerary.ref}
		// >
		//   <ICT002PlanGroupsProvider
		//     parentDocRef={itinerary.ref}
		//   >
		//     <Title>Itinerary</Title>
		//     <Text>{JSON.stringify(itinerary.data())}</Text>
		//     <IPA000TestContent />
		//   </ICT002PlanGroupsProvider>
		// </ICT003PlansProvider>
	);
}
