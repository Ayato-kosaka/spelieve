import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { SearchPlacePropsInterface } from 'spelieve-common/lib/Interfaces';

import { ENV } from '@/ENV';
import i18n from '@/Common/Hooks/i18n-js';

export function PCO001SearchPlace({ onAutoCompleteClicked }: SearchPlacePropsInterface) {
	return (
		<GooglePlacesAutocomplete
			placeholder={i18n.t('地点を入力')}
			onPress={onAutoCompleteClicked}
			query={{
				key: ENV.GCP_API_KEY,
				type: ['(cities)', 'establishment'],
				language: 'ja',
			}}
			fetchDetails
		/>
	);
}
