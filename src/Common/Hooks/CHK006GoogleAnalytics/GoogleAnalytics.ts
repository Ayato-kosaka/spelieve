import analytics from '@react-native-firebase/analytics';

import { GoogleAnalyticsInterface } from './GoogleAnalyticsInterface';

export const CHK006GoogleAnalytics: GoogleAnalyticsInterface = {
	sendAnalyticsLogEvent: (
		event: string,
		params: {
			[key: string]: string | number | boolean;
		} = {},
	) => {
		analytics()
			.logEvent(event, params)
			// eslint-disable-next-line no-console
			.catch((e) => console.error(e));
	},
};
