import React, { FC, useEffect, useState, useContext } from 'react';
import { doc, collection, getDoc, setDoc, addDoc, deleteDoc, DocumentSnapshot } from 'firebase/firestore';
import db from '@/Itinerary/Endpoint/firestore';
import { ActivityIndicator, Text, Title } from 'react-native-paper';

import { IPA000TestContent } from './TestContent'
import { ICT021PlanGroupsListProvider } from '@/Itinerary/Contexts/ICT021PlanGroupsList'
import { ICT031PlansMapProvider } from '@/Itinerary/Contexts/ICT031PlansMap'

export function IPA000Test() {
  const [itinerary, setItinerary] = useState<DocumentSnapshot>();
  
  useEffect(() => {
    const fetch = async () => {
      const documentSnapshot = await getDoc(doc(collection(db, 'Itineraries'), 'nzEQO5MhckDefM4MsAC7'));
      setItinerary(documentSnapshot);
    };
    fetch();
  }, []);
  
  if(!itinerary){
        return <ActivityIndicator animating={true} />
  }
  
  return(
    <ICT031PlansMapProvider
      parentDocRef={itinerary.ref}
    >
      <ICT021PlanGroupsListProvider
        parentDocRef={itinerary.ref}
      >
        <Title>Itinerary</Title>
        <Text>{JSON.stringify(itinerary.data())}</Text>
        <IPA000TestContent />
      </ICT021PlanGroupsListProvider>
    </ICT031PlansMapProvider>
  )
}
