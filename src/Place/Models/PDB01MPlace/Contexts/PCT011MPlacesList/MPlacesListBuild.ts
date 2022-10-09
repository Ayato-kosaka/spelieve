import { PCT011MPlacesListInterface } from './MPlacesListInterface';
import { GeoPoint } from "firebase/firestore/dist/firestore";
import * as CHK001Utils from '@/Common/Hooks/CHK001Utils';

/**
 * Export build function of initial PCT011MPlacesList.
 */
export const PCT011MPlacesListBuild = (): PCT011MPlacesListInterface => ({
    name: '',
    imageUrl: '',
    instagramAPIID: '',
    geometry: new GeoPoint (0, 0),
    geohash: '',
    mapUrl: '',
    website: '',
    address: '',
    phoneNumber: '',
    openingHours: {},
    rating: 0,
    popularTags: [],
    averageStayTime: CHK001Utils.initialDate(),
    createdAt: CHK001Utils.initialDate(),
    updatedAt: CHK001Utils.initialDate(),
})