import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TCT011MThumbnailOneProvider } from '../Contexts/TCT011MThumbnailOne/ThumbnailOne';
import { TCT023DecorationsMapProvider } from '../Contexts/TCT023DecorationsMap/DecorationsMap';

import { TPA001ThumbnailEditor } from './TPA001ThumbnailEditor/ThumbnailEditor';

import { ThumbnailStackParamList } from '@/Common/Navigation/NavigationInterface';

const Stack = createNativeStackNavigator<ThumbnailStackParamList>();

export const ThumbnailPageNavigator = () => (
	<TCT011MThumbnailOneProvider>
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
	</TCT011MThumbnailOneProvider>
);
