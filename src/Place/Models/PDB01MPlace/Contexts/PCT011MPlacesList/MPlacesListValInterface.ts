/**
 * Export interface of PCT011MPlacesList object.
 */
export interface PCT011MPlacesListValInterface {
    placesList: Array<PCT011MPlacesListInterface>;
    setGeopointState: (geopoint: GeoPoint) => void;
    setMaxDistanceState: (maxDistance: number) => void;
} 