import { PDB01MPlaceInterface } from 'spelieve-common/Interface';
import { PropsWithType } from '@/Common/Hooks/CHK003TypeScript';

/**
 * Export Object of column names of PDB01MPlace collection.
 */
export const PDB01MPlaceCols: PropsWithType<PDB01MPlaceInterface, string> = {
    name: 'name',
    imageUrl: 'imageUrl',
    instagramAPIID: 'instagramAPIID',
    geometry: 'geometry',
    mapUrl: 'mapUrl',
    website: 'website',
    address: 'address',
    phoneNumber: 'phoneNumber',
    openingHours: 'openingHours',
    rating: 'rating',
    popularTags: 'popularTags',
    averageStayTime: 'averageStayTime',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
}