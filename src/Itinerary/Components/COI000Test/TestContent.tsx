import { StyleSheet, View } from 'react-native';
import React, { FC, useEffect, useState, useContext } from 'react';
import { doc, collection, getDoc, setDoc, addDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { ICT002PlanGroups, ICT002PlanGroupsInterface } from '@/Itinerary/Contexts/ICT002PlanGroups'

import { Button, Text, Title } from 'react-native-paper';
import db from '@/Itinerary/Endpoint/firestore';

import i18n, { i18nLang } from '@/Common/Hooks/i18n-js';

export default function COI000TestContent() {
    
  const [itinerary, setItinerary] = useState();
  const { querySnapshot } = useContext(ICT002PlanGroups);
  
  useEffect(() => {
    const fetch = async () => {
      const documentSnapshot = await getDoc(doc(collection(db, 'Itineraries'), 'nzEQO5MhckDefM4MsAC7'));
      const i = documentSnapshot.data();
      setItinerary(i);
    };
    fetch();
  }, []);
  
  const swapRepresentativePlanID = () => {
    const data = querySnapshot.docs[0].data();
    const newPlanID = data.plans.find(x => x!=data.representativePlanID) || "";
    setDoc<ICT002PlanGroupsInterface>(
      querySnapshot.docs[0].ref, 
      {...querySnapshot.docs[0].data(), representativePlanID: newPlanID}
    )
  }
  
  return (
    <View>
      <Button icon="camera" mode="outlined" onPress={() => console.log('Pressed')}>
        react-native-paper test
      </Button>
      
      <Title>i18n-js Test</Title>
      <Text>{i18n.t(i18nLang.welcome)}</Text>
      <Text>{i18n.t('こんばんは')}</Text>
      <Text>{i18n.t('I wanna go out with Tom.')}</Text>
      <Text>{i18n.t('I wanna go out with Tom')}</Text>
      
      <Title>Firebase Test</Title>
      <Title>Itinerary</Title>
      <Text>{JSON.stringify(itinerary)}</Text>
      
      <Title>PlanGroups</Title>
      { querySnapshot
        .docs
        .map((doc) => {
          return (
            <View key={doc.id}>
              <Text>representativePlanID: {doc.get('representativePlanID')}</Text>
              <Text>plans: [{doc.get('plans')}]</Text>
            </View>
        );
      })}
      <Button mode="contained" onPress={swapRepresentativePlanID}>
        swap PlanGroups[0]'s representative planID
      </Button>
    </View>
  );
}
