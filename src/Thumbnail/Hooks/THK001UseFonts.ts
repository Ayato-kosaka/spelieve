import { Lato_100Thin, Lato_300Light, Lato_700Bold, Lato_900Black } from '@expo-google-fonts/lato';
import {
	Montserrat_100Thin,
	Montserrat_300Light,
	Montserrat_500Medium,
	Montserrat_700Bold,
	Montserrat_900Black,
} from '@expo-google-fonts/montserrat';
import { NotoSansJavanese_500Medium, NotoSansJavanese_700Bold } from '@expo-google-fonts/noto-sans-javanese';
import { OpenSans_300Light, OpenSans_500Medium, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { Oswald_300Light, Oswald_500Medium, Oswald_700Bold } from '@expo-google-fonts/oswald';
import {
	Poppins_100Thin,
	Poppins_300Light,
	Poppins_500Medium,
	Poppins_700Bold,
	Poppins_900Black,
} from '@expo-google-fonts/poppins';
import {
	Roboto_100Thin,
	Roboto_300Light,
	Roboto_500Medium,
	Roboto_700Bold,
	Roboto_900Black,
} from '@expo-google-fonts/roboto';
import { RobotoCondensed_300Light, RobotoCondensed_700Bold } from '@expo-google-fonts/roboto-condensed';
import {
	RobotoMono_100Thin,
	RobotoMono_300Light,
	RobotoMono_500Medium,
	RobotoMono_700Bold,
} from '@expo-google-fonts/roboto-mono';
import {
	SourceSansPro_300Light,
	SourceSansPro_700Bold,
	SourceSansPro_900Black,
} from '@expo-google-fonts/source-sans-pro';
import { useFonts } from 'expo-font';

export const THK001UseFonts = () => {
	const FONTS = {
		Lato_100Thin,
		Lato_300Light,
		Lato_700Bold,
		Lato_900Black,
		Montserrat_100Thin,
		Montserrat_300Light,
		Montserrat_500Medium,
		Montserrat_700Bold,
		Montserrat_900Black,
		NotoSansJavanese_500Medium,
		NotoSansJavanese_700Bold,
		OpenSans_300Light,
		OpenSans_500Medium,
		OpenSans_700Bold,
		Oswald_300Light,
		Oswald_500Medium,
		Oswald_700Bold,
		Poppins_100Thin,
		Poppins_300Light,
		Poppins_500Medium,
		Poppins_700Bold,
		Poppins_900Black,
		Roboto_100Thin,
		Roboto_300Light,
		Roboto_500Medium,
		Roboto_700Bold,
		Roboto_900Black,
		RobotoCondensed_300Light,
		RobotoCondensed_700Bold,
		RobotoMono_100Thin,
		RobotoMono_300Light,
		RobotoMono_500Medium,
		RobotoMono_700Bold,
		SourceSansPro_300Light,
		SourceSansPro_700Bold,
		SourceSansPro_900Black,
	} as const;
	const FONT_NAMES = [
		'Lato',
		'Montserrat',
		'NotoSansJavanese',
		'OpenSans',
		'Oswald',
		'Poppins',
		'Roboto',
		'RobotoCondensed',
		'RobotoMono',
		'SourceSansPro',
	];
	const [fontsLoaded] = useFonts(FONTS);

	return {
		FONTS,
		FONT_NAMES,
		fontsLoaded,
	};
};
