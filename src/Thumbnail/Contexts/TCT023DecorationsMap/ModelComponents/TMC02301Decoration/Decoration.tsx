import { useCallback, useContext, useMemo } from 'react';
import { Image, StyleProp, View, ViewStyle, StyleSheet } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';

import { TCT023DecorationsMap } from '../../DecorationsMap';

import { DecorationPropsInterface } from './DecorationInterface';

import { TCO001GestureProvider } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProvider';
import { GestureProviderPropsInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';

export const TMC02301Decoration = ({ decorationID }: DecorationPropsInterface) => {
	const { decorationsMap, setDecorationsMap, activeDecorationID } = useContext(TCT023DecorationsMap);
	const decoration = decorationsMap[decorationID];
	console.log('decoration', decorationID, decoration);

	const onEndGesture: GestureProviderPropsInterface['onEndGesture'] = useCallback(
		(val) => {
			console.log('onEndGesture');
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

	const isActive = useDerivedValue(() => activeDecorationID.value === decorationID);
	const onSingleTapFinalize: GestureProviderPropsInterface['onSingleTapFinalize'] = useCallback(
		(event, success) => {
			activeDecorationID.value = decorationID;
		},
		[activeDecorationID, decorationID],
	);

	const gestureStyle: StyleProp<ViewStyle> = useMemo(() => ({ zIndex: decoration.order }), [decoration.order]);

	const styles = StyleSheet.create({ designItemStyle: { width: 100, height: 100 } });

	return (
		<TCO001GestureProvider
			initial={decoration}
			onEndGesture={onEndGesture}
			isActive={isActive}
			onSingleTapFinalize={onSingleTapFinalize}
			viewStyle={gestureStyle}>
			{decoration.decorationType === 'Figure' && (
				<View style={[styles.designItemStyle, { backgroundColor: decoration.color }]} />
			)}
			{decoration.decorationType === 'Image' && (
				<Image style={styles.designItemStyle} source={{ uri: decoration.imageUrl }} />
			)}
		</TCO001GestureProvider>
	);
};
