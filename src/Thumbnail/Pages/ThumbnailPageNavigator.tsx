import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TCT011MThumbnailOneProvider } from '../Contexts/TCT011MThumbnailOne/ThumbnailOne';
import { TCT012MThumbnailListProvider } from '../Contexts/TCT012MThumbnailList/MThumbnailList';
import { TCT023DecorationsMapProvider } from '../Contexts/TCT023DecorationsMap/DecorationsMap';
import { TCT032MMaskShapeListProvider } from '../Contexts/TCT032MMaskShapeList/MMaskShapeList';

import { TPA001ThumbnailEditor } from './TPA001ThumbnailEditor/ThumbnailEditor';
import { TPA002ThumbnailTemplate } from './TPA002ThumbnailTemplate/ThumbnailTemplate';

import i18n from '@/Common/Hooks/i18n-js';
import { ThumbnailStackParamList } from '@/Common/Navigation/NavigationInterface';

const Stack = createNativeStackNavigator<ThumbnailStackParamList>();

export const ThumbnailPageNavigator = () => (
	// サムネイルの一覧のコンテキスト
	<TCT012MThumbnailListProvider>
		{/* 1件のサムネイルのコンテキスト */}
		<TCT011MThumbnailOneProvider>
			{/* ??? */}
			<TCT023DecorationsMapProvider>
				<TCT032MMaskShapeListProvider>
					<Stack.Navigator initialRouteName="TPA001ThumbnailEditor">
						<Stack.Screen
							name="TPA001ThumbnailEditor"
							component={TPA001ThumbnailEditor}
							initialParams={{}}
							options={{ title: '' }}
						/>
						<Stack.Screen
							name="TPA002ThumbnailTemplate"
							component={TPA002ThumbnailTemplate}
							initialParams={{}}
							options={{ title: i18n.t('サムネイルテンプレート選択') }}
						/>
					</Stack.Navigator>
				</TCT032MMaskShapeListProvider>
			</TCT023DecorationsMapProvider>
		</TCT011MThumbnailOneProvider>
	</TCT012MThumbnailListProvider>
);
