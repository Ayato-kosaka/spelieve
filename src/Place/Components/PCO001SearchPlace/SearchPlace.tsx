import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { SearchPlacePropsInterface } from 'spelieve-common/lib/Interfaces';

import i18n from '@/Common/Hooks/i18n-js';
import { ENV } from '@/ENV';
import { GooglePlaceLanguageTagFromIETFLanguageTag } from '@/Place/Hooks/PHK001GooglePlaceAPI';

export const PCO001SearchPlace = ({ onAutoCompleteClicked, hideCities }: SearchPlacePropsInterface) => (
	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/309 Web用プロキシサーバ立てる
	<GooglePlacesAutocomplete
		placeholder={i18n.t('searchPlaceText')}
		onPress={onAutoCompleteClicked}
		query={{
			key: ENV.GCP_API_KEY,
			type: hideCities ? 'establishment' : ['(cities)', 'establishment'],
			language: GooglePlaceLanguageTagFromIETFLanguageTag[i18n.locale],
		}}
		requestUrl={{
			useOnPlatform: 'web',
			url: 'https://maps.googleapis.com/maps/api',
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		}}
		fetchDetails
	/>
);
