import { AddressType, PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useContext, useEffect, useMemo, useState } from 'react';

import { MPlacesListAddressInterface, PlacesPropsInterface } from 'spelieve-common/lib/Interfaces';
import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace';

import { BottomTabParamList } from '@/App';
import { Logger } from '@/Common/Hooks/CHK001Utils';
import i18n from '@/Common/Hooks/i18n-js';
import { PCT011MPlacesList } from '@/Place/Contexts/PCT011MPlacesList';
import { GooglePlaceLanguageTagFromIETFLanguageTag } from '@/Place/Hooks/PHK001GooglePlaceAPI';
import { InitialPlaceParams } from '@/Place/Hooks/PHK002InitialPlaceParam';

export const PPA001PlacesController = ({
	country,
	administrativeAreaLevel1,
	administrativeAreaLevel2,
	locality,
}: PlacesPropsInterface) => {
	const { placesList, setAddress } = useContext(PCT011MPlacesList);
	const navigation = useNavigation<NativeStackNavigationProp<BottomTabParamList>>();
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
			navigation.navigate('Place', {
				screen: 'PPA001Places',
				params: initialPlaceParams,
			});
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
		navigation.navigate('Place', {
			screen: 'PPA002Place',
			params: {
				place_id,
			},
		});
	};

	const onAutocompleteClicked = (data: PlaceAutocompleteResult, details: MPlace | null) => {
		const isIncludes = (arr: AddressType[], target: AddressType[]) => arr.some((el) => target.includes(el));
		const addressType: AddressType[] = [AddressType.establishment];
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

			navigation.navigate('Place', {
				screen: 'PPA001Places',
				params: searchedAddress,
			});
		}
	};

	return { onAutocompleteClicked, onPlaceSelected, isLoading };
};
