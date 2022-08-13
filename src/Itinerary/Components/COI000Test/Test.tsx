import { StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect, useState, FocusEvent, ChangeEvent } from 'react';
import { doc, collection, getDoc, setDoc, addDoc, deleteDoc, getDocs } from 'firebase/firestore';

import { Button } from 'react-native-paper';
import db from '@/Itinerary/Endpoint/firestore';

import i18n, { i18nLang } from '@/Common/Hooks/i18n-js';

export default function COI000Test() {
  const [title, setTitle] = useState();
  useEffect(() => {
    const fetch = async () => {
      const documentSnapshot = await getDoc(doc(collection(db, 'Itineraries'), 'nzEQO5MhckDefM4MsAC7'));
      const t = documentSnapshot.get('title') as string;
      setTitle(t);
    };
    fetch();
  }, []);
  return (
    <View>
      <Text>Firebase Test</Text>
      <Text>{title}</Text>
      <Button icon="camera" mode="outlined" onPress={() => console.log('Pressed')}>
        react-native-paper test
      </Button>
      <Text>i18n-js Test</Text>
      <Text>{i18n.t(i18nLang.welcome)}</Text>
      <Text>{i18n.t('こんばんは')}</Text>
      <Text>{i18n.t('I wanna go out with Tom.')}</Text>
      <Text>{i18n.t('I wanna go out with Tom')}</Text>
    </View>
  );
}
