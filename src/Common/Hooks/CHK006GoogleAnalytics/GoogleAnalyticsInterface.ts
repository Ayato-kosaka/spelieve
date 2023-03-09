export interface GoogleAnalyticsInterface {
	sendAnalyticsLogEvent: (
		event: string,
		params?: {
			[key: string]: string | number | boolean;
		},
	) => void;
}
