import { ENV } from '@/ENV';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { SearchPlacePropsInterface } from 'spelieve-common/lib/Interfaces';

export function PCO001SearchPlace({ onAutoCompleteClicked }: SearchPlacePropsInterface) {
    
    return (
        <GooglePlacesAutocomplete
            placeholder='地点を入力'
            onPress={onAutoCompleteClicked}
            query={{
                key: ENV.GCP_API_KEY,
                type: ['(cities)', 'establishment'], // TODO: 地名と地点
                language: 'ja'
            }}
            fetchDetails
        />
    )
}