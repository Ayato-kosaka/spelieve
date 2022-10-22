import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { SearchPlacePropsInterface } from 'spelieve-common/lib/Interfaces';
import { PCT011MPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';

export const PCO001SearchPlace = (
    { onAutoCompleteClicked, hideDistinct }: SearchPlacePropsInterface
) => {

    return (
        <GooglePlacesAutocomplete
            placeholder='地点を入力'
            onPress={onAutoCompleteClicked}
            query={{
                key: process.env.GCP_API_KEY,
                type: ['(cities)', 'establishment'], // TODO: 地名と地点
                language: 'ja'
            }}
            fetchDetails={true}
        />
    )
}