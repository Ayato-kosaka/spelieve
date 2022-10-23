import { StyleSheet, View } from 'react-native';
import React, { FC, useEffect, useState, useContext } from 'react';
import { doc, collection, getDoc, setDoc, addDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { ICT002PlanGroups, ICT002PlanGroupsInterface } from '@/Itinerary/Contexts/ICT002PlanGroups'
import { ICT003Plans, ICT003PlansInterface } from '@/Itinerary/Contexts/ICT003Plans'

import { Button, Text, Title } from 'react-native-paper';
import db from '@/Itinerary/Endpoint/firestore';

import i18n, { i18nLang } from '@/Common/Hooks/i18n-js';

export function IPA000TestContent() {

  const { querySnapshot } = useContext(ICT002PlanGroups);
  const useICT003Plans = useContext(ICT003Plans);

  const swapRepresentativePlanID = () => {
    const data = querySnapshot.docs[0].data();
    const newPlanID = data.plans.find(x => x != data.representativePlanID) || "";
    setDoc<ICT002PlanGroupsInterface>(
      querySnapshot.docs[0].ref,
      { ...querySnapshot.docs[0].data(), representativePlanID: newPlanID }
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

      <Title>PlanGroups</Title>
      {querySnapshot
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


      <Title>Plans</Title>
      {
        Object.keys(useICT003Plans.documentSnapshots).map((key) => (
          <View key={key}>
            <Text>{key}</Text>
            <Text>{JSON.stringify(useICT003Plans.documentSnapshots[key].data())}</Text>
            <Button mode="contained" onPress={() => setDoc<ICT003PlansInterface>(useICT003Plans.documentSnapshots[key].ref, { ...useICT003Plans.documentSnapshots[key].data(), title: (new Date()).getTime().toString() })}>
              update title
            </Button>
            <Button mode="contained" onPress={() => deleteDoc(useICT003Plans.documentSnapshots[key].ref)}>
              delete
            </Button>
          </View>
        ))
      }
      <Button mode="contained" onPress={() => useICT003Plans.create()}>
        Create Plan
      </Button>
    </View>
  );
}
