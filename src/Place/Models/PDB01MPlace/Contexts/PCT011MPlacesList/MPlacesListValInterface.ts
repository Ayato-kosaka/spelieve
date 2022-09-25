/**
 * Export interface of PCT011MPlacesList object.
 */
export interface PCT011MPlacesListValInterface {
    placesList: Array<PCT011MPlacesListInterface>;
    setGeopoint: (geopoint: GeoPoint) => void;
    setMaxDistance: (maxDistance: number) => void;
} 