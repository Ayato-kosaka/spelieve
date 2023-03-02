import { getAnalytics, logEvent } from 'firebase/analytics';

import { GoogleAnalyticsInterface } from './GoogleAnalyticsInterface';

import app from '@/Common/Endpoint/firebase';

const webAnalytics = getAnalytics(app);

export const CHK006GoogleAnalytics: GoogleAnalyticsInterface = {
	sendAnalyticsLogEvent: (
		event: string,
		params: {
			[key: string]: string | number | boolean;
		} = {},
	) => {
		logEvent(webAnalytics, event, params);
	},
};
