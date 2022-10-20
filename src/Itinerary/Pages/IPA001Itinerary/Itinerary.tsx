import React, { FC, useEffect, useState, useContext } from 'react';
import { doc, collection, getDoc, setDoc, addDoc, deleteDoc, DocumentSnapshot } from 'firebase/firestore';
import db from '@/Itinerary/Endpoint/firestore';
import { ActivityIndicator, Text, Title } from 'react-native-paper';
import { ICT011ItineraryOneProvider } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';

export function IPA001Itinerary() {
  const id = '04CDrHKLyHMULvIkjuVT';
  
  return(
    <ICT011ItineraryOneProvider
    id={id}
    >
    </ICT011ItineraryOneProvider>
  )
}
