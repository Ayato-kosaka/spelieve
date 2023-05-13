import analytics from '@react-native-firebase/analytics';

import { GoogleAnalyticsInterface } from './GoogleAnalyticsInterface';

// react-native-maps と、expo-firebase-analytics を一緒に使うと、エラーになるため、
// このファイルを作成し、react-native-firebase/analytics を使うようにする。
export const CHK006GoogleAnalytics: GoogleAnalyticsInterface = {
	sendAnalyticsLogEvent: (
		event: string,
		params: {
			[key: string]: string | number | boolean;
		} = {},
	) => {
		analytics()
			.logEvent(event, params)
			// Dependency cycle となるため、例外的に console.error を使う
			// eslint-disable-next-line no-console
			.catch((e) => console.error('CHK006GoogleAnalytics', 'sendAnalyticsLogEvent', e));
	},
	getAppInstanceId: () => analytics().getAppInstanceId(),
};
