import { AddressType, PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useContext, useEffect, useState } from 'react';

import {
	MPlacesListAddressInterface,
	PlacesPropsInterface,
} from 'spelieve-common/lib/Interfaces';
import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace';

import { BottomTabParamList } from '@/App';
import { PCT011MPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';

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
				params: {
					country: '日本',
					administrativeAreaLevel1: '神奈川県',
					administrativeAreaLevel2: '',
					locality: '横浜市',
				},
			});
		}
	}, [country, administrativeAreaLevel1, administrativeAreaLevel2, locality, navigation, setAddress]);

	const onPlaceSelected = (place_id: string) => {
		navigation.navigate('Place', {
			screen: 'PPA002Place',
			params: {
				place_id,
			},
		});
	};

	const onAutoCompleteClicked = (data: PlaceAutocompleteResult, details: MPlace | null) => {
		const isIncludes = (arr: AddressType[], target: AddressType[]) => arr.some((el) => target.includes(el));
		const addressType: AddressType[] = [AddressType.establishment, AddressType.geocode];
		const sendedDataTypes: AddressType[] = data.types;

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

	return { onAutoCompleteClicked, onPlaceSelected, isLoading };
};
