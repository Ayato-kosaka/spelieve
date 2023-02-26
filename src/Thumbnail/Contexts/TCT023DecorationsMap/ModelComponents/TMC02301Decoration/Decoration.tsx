import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { Image, StyleProp, ViewStyle, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated from 'react-native-reanimated';

import { TCT023DecorationsMap } from '../../DecorationsMap';

import { DecorationPropsInterface } from './DecorationInterface';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { TCO001GestureProvider } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProvider';
import { TCO001UseAnimatedStyle } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderController';
import { GestureProviderPropsInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';

export const TMC02301Decoration = ({ decorationID, onLoad }: DecorationPropsInterface) => {
	const { thumbnailItemMapper } = useContext(CCO001ThumbnailEditor);
	const { storeUrlMap, textMap } = thumbnailItemMapper;
	const { decorationsMap, setDecorationsMap, activeDecorationID, setActiveDecorationID } =
		useContext(TCT023DecorationsMap);
	const decoration = decorationsMap[decorationID]!;

	const value = useMemo(() => {
		if (decoration.decorationType === 'Video') {
			return storeUrlMap[decoration.key!];
		}
		if (decoration.decorationType === 'Image') {
			// TODO: 修正する
			return storeUrlMap[decoration.key!] || 'https://thumb.photo-ac.com/15/1527a37a819426cf6ac7a8761eb4bf67_t.jpeg';
		}
		if (decoration.decorationType === 'Text') {
			return textMap[decoration.key!];
		}
		return undefined;
	}, [decoration.decorationType, decoration.key, storeUrlMap, textMap]);

	// 読み完了時に props.onLoad を実行する処理
	const sourceLoadRef = useRef<{ isLoading: boolean; onLoad?: () => void }>({ isLoading: false });
	useEffect(() => {
		if (value) {
			sourceLoadRef.current.isLoading = true;
		}
	}, [value]);
	const onSourceLoad = useCallback(() => {
		sourceLoadRef.current.onLoad?.();
		sourceLoadRef.current.isLoading = false;
		sourceLoadRef.current.onLoad = undefined;
	}, []);
	useEffect(() => {
		if (sourceLoadRef.current.isLoading) {
			sourceLoadRef.current.onLoad = onLoad;
		} else {
			onLoad?.();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onLoad]);

	const onEndGesture: GestureProviderPropsInterface['onEndGesture'] = useCallback(
		(val) => {
			setDecorationsMap({
				...decorationsMap,
				[decorationID]: {
					...decoration,
					transform: {
						...decoration.transform,
						...val,
					},
				},
			});
		},
		[decoration, decorationID, decorationsMap, setDecorationsMap],
	);

	const isActive = useMemo(() => activeDecorationID === decorationID, [activeDecorationID, decorationID]);
	const onSingleTapFinalize: GestureProviderPropsInterface['onSingleTapFinalize'] = useCallback(() => {
		setActiveDecorationID(decorationID);
	}, [decorationID, setActiveDecorationID]);

	const viewStyle: StyleProp<ViewStyle> = useMemo(
		() => ({ zIndex: decoration.order, position: 'absolute', borderWidth: isActive ? 1 : 0 }),
		[decoration.order, isActive],
	);

	const styles = StyleSheet.create({ designItemStyle: { width: 100, height: 100 } });

	const { onAnimating, animatedStyle } = TCO001UseAnimatedStyle();

	return (
		<TCO001GestureProvider
			initial={decoration.transform}
			onEndGesture={onEndGesture}
			isActive={isActive}
			onSingleTapFinalize={onSingleTapFinalize}
			onAnimating={onAnimating}>
			<Animated.View style={[animatedStyle, viewStyle]}>
				{decoration.decorationType === 'Figure' && (
					<View style={[styles.designItemStyle, { backgroundColor: decoration.color }]} />
				)}
				{decoration.decorationType === 'Image' && (
					<Image
						style={styles.designItemStyle}
						source={{
							uri: value,
						}}
						onLoad={onSourceLoad}
					/>
				)}
				{decoration.decorationType === 'Text' && decoration.key && <Text>{value || 'Dummy Text'}</Text>}
			</Animated.View>
		</TCO001GestureProvider>
	);
};
