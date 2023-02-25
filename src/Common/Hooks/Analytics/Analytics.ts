import analytics from '@react-native-firebase/analytics';

export const sendAnalyticsLogEvent = async (event: string, parameter: object = {}) => {
	await analytics().logEvent(event, parameter);
};
