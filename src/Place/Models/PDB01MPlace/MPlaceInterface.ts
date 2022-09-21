import { GeoPoint } from "firebase/firestore/dist/firestore";

/**
 * Export interface of PDB01MPlace collection.
 */
export interface PDB01MPlaceInterface {
    name: string;
    imageUrl: string;
    instagramAPIID: string;
    geometry: GeoPoint;
    mapUrl: string;
    website: string;
    address: string;
    phoneNumber: string;
    openingHours: // map;
    rating: number;
    popularTags: // array;
    averageStayTime: Timestamp;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};