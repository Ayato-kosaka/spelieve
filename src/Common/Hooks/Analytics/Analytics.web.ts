import { getAnalytics, logEvent } from 'firebase/analytics';

import app from '@/Common/Endpoint/firebase';

const webAnalytics = getAnalytics(app);

export const sendAnalyticsLogEvent = (
	event: string,
	params: {
		[key: string]: string | number | boolean;
	} = {},
) => {
	logEvent(webAnalytics, event, params);
};
