import { useCallback, useContext } from 'react';
import Animated, { useSharedValue } from 'react-native-reanimated';

import { TCT023DecorationsMap } from '../../DecorationsMap';

import { DecorationPropsInterface } from './DecorationInterface';

import { TCO001GestureProvider } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProvider';
import { GestureProviderPropsInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';

export const TMC02301Decoration = ({ decorationID }: DecorationPropsInterface) => {
	const isActive = true;
	const a = useSharedValue(1);

	const { decorationsMap, setDecorationsMap } = useContext(TCT023DecorationsMap);
	const decoration = decorationsMap[decorationID];
	console.log('decoration', decoration);

	const onEndGesture: GestureProviderPropsInterface['onEnd'] = useCallback(
		(val) => {
			setDecorationsMap({
				...decorationsMap,
				[decorationID]: {
					...decorationsMap[decorationID],
					...val,
				},
			});
		},
		[decorationID, decorationsMap, setDecorationsMap],
	);

	// Context に変化が合った場合は、gesture 用の useSharedValue を更新する
	// useEffect(() => {
	// 	translateX.value = decoration.translateX;
	// }, [decoration.translateX, savedTranslateX.value]);
	// useEffect(() => {
	// 	translateY.value = decoration.translateY;
	// }, [decoration.translateY, translateY]);
	// useEffect(() => {
	// 	scale.value = decoration.scale;
	// }, [decoration.scale, scale]);
	// useEffect(() => {
	// 	rotateZ.value = decoration.rotateZ;
	// }, [decoration.rotateZ, rotateZ]);

	// const activeStyle: StyleProp<ViewStyle> = isActive ?{
	// 	border
	// }: {}

	const style = [
		{ width: 100, height: 100, backgroundColor: decoration.color, zIndex: decoration.order },
		// animatedStyle,
		// activeStyle,
	];

	return (
		<TCO001GestureProvider initial={decoration} onEnd={onEndGesture}>
			<Animated.View style={style} />
		</TCO001GestureProvider>
	);
};
