import { useCallback, useContext } from 'react';
import { Image, View } from 'react-native';
import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated';

import { TCT023DecorationsMap } from '../../DecorationsMap';

import { DecorationPropsInterface } from './DecorationInterface';

import { TCO001GestureProvider } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProvider';
import { GestureProviderPropsInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';

export const TMC02301Decoration = ({ decorationID }: DecorationPropsInterface) => {
	const { decorationsMap, setDecorationsMap, activeDecorationID } = useContext(TCT023DecorationsMap);
	const decoration = decorationsMap[decorationID];
	console.log('decoration', decorationID, decoration);

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

	const isActive = useSharedValue(false);
	useAnimatedReaction(
		() => activeDecorationID.value,
		(result, previous) => {
			if (result !== previous) {
				console.log('useDerivedValue', activeDecorationID.value);
				isActive.value = activeDecorationID.value === decorationID;
			}
		},
		[],
	);
	const onSingleTapFinalize: GestureProviderPropsInterface['onSingleTapFinalize'] = useCallback(
		(event, success) => {
			activeDecorationID.value = decorationID;
		},
		[activeDecorationID, decorationID],
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

	const style = [
		{ width: 100, height: 100, backgroundColor: decoration.color, zIndex: decoration.order },
		// animatedStyle,
	];

	return (
		<TCO001GestureProvider
			initial={decoration}
			onEnd={onEndGesture}
			isActive={isActive}
			onSingleTapFinalize={onSingleTapFinalize}>
			{decoration.decorationType === 'Figure' && <View style={style} />}
			{decoration.decorationType === 'Image' && <Image style={style} source={{ uri: decoration.imageUrl }} />}
		</TCO001GestureProvider>
	);
};
