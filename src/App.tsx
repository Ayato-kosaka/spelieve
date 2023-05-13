import 'expo-dev-client';

import crashlytics from '@react-native-firebase/crashlytics';
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from './AppProvider';
import { CHK006GoogleAnalytics } from './Common/Hooks/CHK006GoogleAnalytics/GoogleAnalytics';
import { Navigation } from './Common/Navigation/Navigation';
import { paperTheme } from './ThemeProvider';

export const App = () => {
	useEffect(() => {
		const logAppOpen = async () => {
			CHK006GoogleAnalytics.sendAnalyticsLogEvent('app_open', {});
			const appInstaceId = await CHK006GoogleAnalytics.getAppInstanceId();
			if (appInstaceId !== null) {
				await crashlytics().setAttribute('appInstanceId', appInstaceId);
			}
		};
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		logAppOpen();
	});
	return (
		<SafeAreaProvider>
			<PaperProvider theme={paperTheme}>
				<AppProvider>
					<Navigation />
				</AppProvider>
			</PaperProvider>
		</SafeAreaProvider>
	);
};
export default App;

registerRootComponent(App);
