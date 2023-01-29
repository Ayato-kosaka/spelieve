import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TCT023DecorationsMapProvider } from '../Contexts/TCT023DecorationsMap/DecorationsMap';

import { TPA001ThumbnailEditor } from './TPA001ThumbnailEditor/ThumbnailEditor';

import { ThumbnailStackParamList } from '@/Common/Navigation/NavigationInterface';

const Stack = createNativeStackNavigator<ThumbnailStackParamList>();

export const ThumbnailPageNavigator = () => (
	<TCT023DecorationsMapProvider>
		<Stack.Navigator initialRouteName="TPA001ThumbnailEditor">
			<Stack.Screen
				name="TPA001ThumbnailEditor"
				component={TPA001ThumbnailEditor}
				initialParams={{}}
				options={{ title: '' }}
			/>
		</Stack.Navigator>
	</TCT023DecorationsMapProvider>
);
