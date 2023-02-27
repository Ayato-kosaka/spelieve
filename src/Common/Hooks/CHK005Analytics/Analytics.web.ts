import { getAnalytics, logEvent } from 'firebase/analytics';

import app from '@/Common/Endpoint/firebase';

const webAnalytics = getAnalytics(app);

export const CHK005Analytics = {
	sendAnalyticsLogEvent: (
		event: string,
		params: {
			[key: string]: string | number | boolean;
		} = {},
	) => {
		logEvent(webAnalytics, event, params);
	},
};
