import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { SearchPlacePropsInterface } from 'spelieve-common/lib/Interfaces';

import i18n from '@/Common/Hooks/i18n-js';
import { ENV } from '@/ENV';
import { useEffect } from 'react';

export const PCO001SearchPlace = ({ onAutoCompleteClicked, hideCities }: SearchPlacePropsInterface) => (
	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/309 Web用プロキシサーバ立てる
	<GooglePlacesAutocomplete
		placeholder={i18n.t('searchPlaceText')}
		onPress={onAutoCompleteClicked}
		query={{
			key: ENV.GCP_API_KEY,
			type: hideCities ? 'establishment' :['(cities)', 'establishment'],
			language: 'ja', // TODO: https://github.com/Ayato-kosaka/spelieve/issues/281 端末言語情報グローバルに持つ
		}}
		requestUrl={{
			useOnPlatform: 'web',
			url: `${ENV.PROXY_SERVER_URL}https://maps.googleapis.com/maps/api`,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		}}
		fetchDetails
	/>
);
