/**
 * Export interface of PCT011MPlacesList object.
 */
export interface PCT011MPlacesListProviderPropsInterface {
    parentDocRef?: DocumentReference;
    children: ReactNode;
    geopoint: GeoPoint;
    maxDistance: number;
} 