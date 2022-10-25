import { FirestoreDataConverter, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
// import { PDB01MPlaceInterface } from '@/Place/Models/PDB01MPlace';
import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace'
import { MPlacesListInterface } from 'spelieve-common/lib/Interfaces';
import { PCT011MPlacesListBuild } from '../../MPlacesListBuild';
/**
* Export a FirestoreDataConverter to transform PCT011MPlacesList into Firestore data.
*/
export const PCT011MPlacesListConverter = (): FirestoreDataConverter<MPlacesListInterface> => ({
    /**
    * Convert PCT011MPlacesList before be saved to Firestore.
    */
    toFirestore: (data: MPlacesListInterface): MPlace => ({
            name: data.name,
            imageUrl: data.imageUrl,
            instagramAPIID: data.instagramAPIID,
            geometry: data.geometry,
            geohash: data.geohash,
            mapUrl: data.mapUrl,
            website: data.website,
            address: data.address,
            phoneNumber: data.phoneNumber,
            openingHours: data.openingHours,
            rating: data.rating,
            popularTags: data.popularTags,
            averageStayTime: Timestamp.fromDate(data.averageStayTime),
            createdAt: Timestamp.fromDate(data.createdAt),
            updatedAt: Timestamp.fromDate(data.updatedAt),
        }),
    
    /**
    * Convert the data from Firestore to match PCT011MPlacesList.
    */
    fromFirestore: (snapshot: QueryDocumentSnapshot<MPlace>): MPlacesListInterface => {
        const initData: MPlacesListInterface = PCT011MPlacesListBuild();
        return {
            name: snapshot.data().name || initData.name,
            imageUrl: snapshot.data().imageUrl || initData.imageUrl,
            instagramAPIID: snapshot.data().instagramAPIID || initData.instagramAPIID,
            geometry: snapshot.data().geometry || initData.geometry,
            geohash: snapshot.data().geohash || initData.geohash,
            mapUrl: snapshot.data().mapUrl || initData.mapUrl,
            website: snapshot.data().website || initData.website,
            address: snapshot.data().address || initData.address,
            phoneNumber: snapshot.data().phoneNumber || initData.phoneNumber,
            openingHours: snapshot.data().openingHours || initData.openingHours,
            rating: snapshot.data().rating || initData.rating,
            popularTags: snapshot.data().popularTags || initData.popularTags,
            averageStayTime: snapshot.data().averageStayTime.toDate() || initData.averageStayTime,
            createdAt: snapshot.data().createdAt.toDate() || initData.createdAt,
            updatedAt: snapshot.data().updatedAt.toDate() || initData.updatedAt,
        }
    }
});