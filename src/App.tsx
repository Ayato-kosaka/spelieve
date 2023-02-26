import 'expo-dev-client';

import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from './AppProvider';
import { Navigation } from './Common/Navigation/Navigation';
import { paperTheme } from './ThemeProvider';

export const App = () => (
	<SafeAreaProvider>
		<PaperProvider theme={paperTheme}>
			<AppProvider>
				<Navigation />
			</AppProvider>
		</PaperProvider>
	</SafeAreaProvider>
);
export default App;

registerRootComponent(App);
