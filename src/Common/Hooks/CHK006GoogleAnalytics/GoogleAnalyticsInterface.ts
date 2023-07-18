import { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics';

export interface GoogleAnalyticsInterface {
	sendAnalyticsLogEvent: (
		event: string,
		params?: {
			[key: string]: string | number | boolean;
		},
	) => void;
	getAppInstanceId: FirebaseAnalyticsTypes.Module['getAppInstanceId'];
}
