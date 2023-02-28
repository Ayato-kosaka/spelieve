import { getAnalytics, logEvent } from 'firebase/analytics';

import app from '@/Common/Endpoint/firebase';
import { GoogleAnalyticsInterface } from './GoogleAnalyticsInterface';

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
