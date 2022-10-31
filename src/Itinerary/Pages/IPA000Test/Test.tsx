import { doc, collection, getDoc, DocumentSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, Title } from 'react-native-paper';

import db from '@/Itinerary/Endpoint/firestore';
import { View } from 'react-native';

export function IPA000Test() {
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
