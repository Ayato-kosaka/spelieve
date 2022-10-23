import React, { FC, useEffect, useState, useContext } from 'react';
import { doc, collection, getDoc, setDoc, addDoc, deleteDoc, DocumentSnapshot } from 'firebase/firestore';
import db from '@/Itinerary/Endpoint/firestore';
import { ActivityIndicator, Text, Title } from 'react-native-paper';

import { IPA000TestContent } from './TestContent'
import { ICT002PlanGroupsProvider } from '@/Itinerary/Contexts/ICT002PlanGroups'
import { ICT003PlansProvider } from '@/Itinerary/Contexts/ICT003Plans'

export function IPA000Test() {
  const [itinerary, setItinerary] = useState<DocumentSnapshot>();
  console.log(process.env)
  
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
    <><Title>Itinerary</Title><Text>{JSON.stringify(itinerary.data())}</Text></>
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
  )
}
