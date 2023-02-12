import 'expo-dev-client';

import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from './AppProvider';
import { Navigation } from './Common/Navigation/Navigation';
import { paperTheme } from './ThemeProvider';
import analytics from '@react-native-firebase/analytics';
import { Button } from 'react-native';

export const App = () => (
	<SafeAreaProvider>
		<PaperProvider theme={paperTheme}>
			<AppProvider>
				<Navigation />
				<Button
					title="Add To Basket"
					onPress={async () =>
					await analytics().logEvent('basket', {
						id: 3745092,
						item: 'mens grey t-shirt',
						description: ['round neck', 'long sleeved'],
						size: 'L',
					})
					}
				/>
			</AppProvider>
		</PaperProvider>
	</SafeAreaProvider>
);
export default App;

registerRootComponent(App);
