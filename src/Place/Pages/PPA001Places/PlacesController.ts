import { AddressType, PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import { useContext, useEffect, useMemo, useState } from 'react';

import { MPlacesListAddressInterface } from 'spelieve-common/lib/Interfaces';
import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace';

import { Logger } from '@/Common/Hooks/CHK001Utils';
import i18n from '@/Common/Hooks/i18n-js';
import { PlaceStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { PCT011MPlacesList } from '@/Place/Contexts/PCT011MPlacesList';
import { GooglePlaceLanguageTagFromIETFLanguageTag } from '@/Place/Hooks/PHK001GooglePlaceAPI';
import { InitialPlaceParams } from '@/Place/Hooks/PHK002InitialPlaceParam';

export const PPA001PlacesController = ({ navigation, route }: PlaceStackScreenProps<'PPA001Places'>) => {
	const { country, administrativeAreaLevel1, administrativeAreaLevel2, locality } = route.params;
	const { placesList, setAddress } = useContext(PCT011MPlacesList);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const PCT011MPlacesListVal = useContext(PCT011MPlacesList);
	const initialPlaceParams = useMemo(
		() => InitialPlaceParams[GooglePlaceLanguageTagFromIETFLanguageTag[i18n.locale]],
		[],
	);

	useEffect(() => {
		if (placesList.length === 0 && PCT011MPlacesListVal.isLoading) {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [placesList, PCT011MPlacesListVal.isLoading]);

	useEffect(() => {
		if (country) {
			setAddress({ country, administrativeAreaLevel1, administrativeAreaLevel2, locality });
		} else {
			// TODO: https://github.com/Ayato-kosaka/spelieve/issues/305 現在地からGepoint取得
			navigation.navigate('PPA001Places', initialPlaceParams);
		}
	}, [
		country,
		administrativeAreaLevel1,
		administrativeAreaLevel2,
		locality,
		navigation,
		setAddress,
		initialPlaceParams,
	]);

	const onPlaceSelected = (place_id: string) => {
		navigation.navigate('PPA002Place', {
			place_id,
		});
	};

	const onAutocompleteClicked = (data: PlaceAutocompleteResult, details: MPlace | null) => {
		const isIncludes = (arr: AddressType[], target: AddressType[]) => arr.some((el) => target.includes(el));
		// https://github.com/Ayato-kosaka/spelieve/issues/595 の検討により以下３つのAddressTypeを指定
		const addressType: AddressType[] = [AddressType.street_address, AddressType.establishment, AddressType.premise];
		const sendedDataTypes: AddressType[] = data.types;
		Logger('PPA001PlacesController', 'onAutocompleteClicked', { data, details });

		if (isIncludes(sendedDataTypes, addressType)) {
			// 地点
			onPlaceSelected(data.place_id);
		} else {
			// 地名
			const searchedAddress: MPlacesListAddressInterface = {
				country: details?.country,
				administrativeAreaLevel1: details?.administrativeAreaLevel1,
				administrativeAreaLevel2: details?.administrativeAreaLevel2,
				locality: details?.locality,
			};

			navigation.navigate('PPA001Places', searchedAddress);
		}
	};

	return { onAutocompleteClicked, onPlaceSelected, isLoading };
};
