import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';

import {
	MPlaceOpeningHoursInterface,
	PlaceControllerInterface,
	PlacePropsInterface,
} from 'spelieve-common/lib/Interfaces';

import { BottomTabParamList } from '@/App';
import i18n from '@/Common/Hooks/i18n-js';

export const PPA002PlaceController = ({ place_id, language }: PlacePropsInterface): PlaceControllerInterface => {
	const navigation = useNavigation<NativeStackNavigationProp<BottomTabParamList>>();

	const onCreateItineraryClicked = (placeName: string) => {
		navigation.navigate('Place', {
			screen: 'IPA001ItineraryEdit',
			params: { place_id, placeName },
		});
	};

	const displayOpeningHours = (
		openingHours: MPlaceOpeningHoursInterface[] | undefined,
	): string | Array<[string, string]> => {
		if (!openingHours) {
			return i18n.t('No Opening Hours Infomation');
		}

		if (openingHours.length === 1 && !openingHours[0].close) {
			return i18n.t('Open 24hours');
		}

		const days: { [key: number]: string } = {
			0: 'Sunday',
			1: 'Monday',
			2: 'Tuesday',
			3: 'Wednesday',
			4: 'Thursday',
			5: 'Friday',
			6: 'Saturday',
		};
		const changeTimeView = (time: string): string => {
			// 1300->13:00
			const hours = time.slice(0, 2);
			const minutes = time.slice(2, 4);
			return `${hours  }:${  minutes}`;
		};
		return openingHours.map((openingHour) => {
			const {open} = openingHour;
			const {close} = openingHour;
			const day = days[open.day];
			const time = `${changeTimeView(open.time)  }~${  changeTimeView(close.time)}`;
			return [i18n.t(day), time];
		});
	};

	const onImageClicked = () => {};

	return { onCreateItineraryClicked, displayOpeningHours };
};
