import 'expo-dev-client';
import 'setimmediate';
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from './AppProvider';
import { Navigation } from './Common/Navigation/Navigation';
import { paperTheme } from './ThemeProvider';

export const App = () => (
	// crashlytics を呼び出すと、web でエラーが発生するため、appInstanceId のセットは行わない
	<SafeAreaProvider>
		<PaperProvider theme={paperTheme}>
			<AppProvider>
				<MenuProvider>
					<Navigation />
				</MenuProvider>
			</AppProvider>
		</PaperProvider>
	</SafeAreaProvider>
);
export default App;

registerRootComponent(App);
