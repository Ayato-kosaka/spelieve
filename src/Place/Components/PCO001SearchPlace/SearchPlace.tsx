import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { SearchPlacePropsInterface } from 'spelieve-common/lib/Interfaces';

import i18n from '@/Common/Hooks/i18n-js';
import { ENV } from '@/ENV';

export const PCO001SearchPlace = ({ onAutoCompleteClicked }: SearchPlacePropsInterface) => (
		<GooglePlacesAutocomplete
			placeholder={i18n.t('地点を入力')}
			onPress={onAutoCompleteClicked}
			query={{
				key: ENV.GCP_API_KEY,
				type: ['(cities)', 'establishment'],
				language: 'ja',
			}}
			requestUrl={{
				useOnPlatform: 'web',
				url: `${ENV.PROXY_SERVER_URL  }https://maps.googleapis.com/maps/api`,
				headers: {
					'Access-Control-Allow-Origin': '*',
				},
			}}
			fetchDetails
		/>
	)
