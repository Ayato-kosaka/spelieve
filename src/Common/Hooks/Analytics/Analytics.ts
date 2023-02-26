import analytics from '@react-native-firebase/analytics';

export const sendAnalyticsLogEvent = async (
	event: string,
	params: {
		[key: string]: string | number | boolean;
	} = {},
) => {
	await analytics().logEvent(event, params);
};
