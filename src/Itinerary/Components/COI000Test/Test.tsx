import { StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect, useState, FocusEvent, ChangeEvent } from 'react';
import db from '@/Itinerary/Endpoint/firestore';
import { doc, collection, getDoc, setDoc, addDoc, deleteDoc, getDocs } from 'firebase/firestore';

import { Button } from 'react-native-paper';

export default function COI000Test() {
  const [title, setTitle] = useState();
  useEffect(() => {
      fetch()
  }, []);
  const fetch = async () => {
    const documentSnapshot = await getDoc(doc(collection(db, 'Itineraries'), 'nzEQO5MhckDefM4MsAC7'));
    setTitle(documentSnapshot.get('title'));
  }
  return (
    <View>
      <Text>Firebase Test</Text>
      <Text>{title}</Text>
      <Button icon="camera" mode="outlined" onPress={() => console.log('Pressed')}>
        react-native-paper test
      </Button>
    </View>
  );
}