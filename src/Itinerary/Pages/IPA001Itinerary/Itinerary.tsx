import React, { FC, useEffect, useState, useContext } from 'react';
import { doc, collection, getDoc, setDoc, addDoc, deleteDoc, DocumentSnapshot } from 'firebase/firestore';
import db from '@/Itinerary/Endpoint/firestore';
import { ActivityIndicator, Text, Title } from 'react-native-paper';

export function IPA000Test() {
  const [itinerary, setItinerary] = useState<DocumentSnapshot>();
  
  return(
    <ICT003PlansProvider
      parentDocRef={itinerary.ref}
    >
    </ICT003PlansProvider>
  )
}
