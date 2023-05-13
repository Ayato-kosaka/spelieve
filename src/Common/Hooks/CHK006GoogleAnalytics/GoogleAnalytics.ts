import analytics from '@react-native-firebase/analytics';

import { consoleError } from '../CHK001Utils';

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
			.catch((e) => consoleError('CHK006GoogleAnalytics', 'sendAnalyticsLogEvent', e));
	},
};
