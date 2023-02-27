import analytics from '@react-native-firebase/analytics';

export const CHK005Analytics = {
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
