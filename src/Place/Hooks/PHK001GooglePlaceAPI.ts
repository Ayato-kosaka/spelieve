import { Icon } from '@expo/vector-icons/build/createIconSet';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Language, TransitMode, TravelMode, TravelRestriction } from '@googlemaps/google-maps-services-js';

import i18n from '@/Common/Hooks/i18n-js';

export const GooglePlaceLanguageTagFromIETFLanguageTag: { [key: string]: Language } = {
	ja: Language.ja,
	en: Language.en,
};

export const travelModeConverter: {
	[key in TravelMode]: {
		iconName: typeof MaterialCommunityIcons extends Icon<infer T, string> ? T : never;
		title: string;
	};
} = {
	[TravelMode.bicycling]: {
		iconName: 'bicycle',
		title: i18n.t('Bicycling'),
	},
	[TravelMode.driving]: {
		iconName: 'car',
		title: i18n.t('Driving'),
	},
	[TravelMode.transit]: {
		iconName: 'subway-variant',
		title: i18n.t('Transit'),
	},
	[TravelMode.walking]: {
		iconName: 'walk',
		title: i18n.t('Walking'),
	},
} as const;

export const transitModeConverter: {
	[key in TransitMode]: {
		iconName: typeof MaterialCommunityIcons extends Icon<infer T, string> ? T : never;
		title: string;
	};
} = {
	[TransitMode.bus]: {
		iconName: 'bus',
		title: i18n.t('Bus'),
	},
	[TransitMode.rail]: {
		iconName: 'train-variant',
		title: i18n.t('Rail'),
	},
	[TransitMode.subway]: {
		iconName: 'subway',
		title: i18n.t('Subway'),
	},
	[TransitMode.train]: {
		iconName: 'train',
		title: i18n.t('Train'),
	},
	[TransitMode.tram]: {
		iconName: 'tram',
		title: i18n.t('Tram'),
	},
};

export const travelRestrictionConverter: {
	[key in TravelRestriction]: {
		title: string;
	};
} = {
	[TravelRestriction.highways]: {
		title: i18n.t('Avoid highways'),
	},
	[TravelRestriction.tolls]: {
		title: i18n.t('Avoid tolls'),
	},
	[TravelRestriction.ferries]: {
		title: i18n.t('Avoid ferries'),
	},
	[TravelRestriction.indoor]: {
		title: i18n.t('Avoid Indoors'),
	},
};
