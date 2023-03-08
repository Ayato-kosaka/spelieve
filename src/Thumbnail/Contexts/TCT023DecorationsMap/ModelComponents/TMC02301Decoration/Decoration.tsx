import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { TCT023DecorationsMap } from '../../DecorationsMap';
import { TMC02302MaskedDecoration } from '../TMC02302MaskedDecoration/MaskedDecoration';

import { DecorationPropsInterface } from './DecorationInterface';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { TCO001GestureProvider } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProvider';
import { TCO001UseAnimatedStyle } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderController';
import { GestureProviderPropsInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';
import { ThumnailRule } from '@/Thumbnail/Hooks/ThumbnailRule';

export const TMC02301Decoration = ({ decorationID, onLoad }: DecorationPropsInterface) => {
	const { thumbnailItemMapper } = useContext(CCO001ThumbnailEditor);
	const { storeUrlMap, textMap } = thumbnailItemMapper;
	const { decorationsMap, setDecorationsMap, activeDecorationID, setActiveDecorationID } =
		useContext(TCT023DecorationsMap);
	const decoration = decorationsMap[decorationID]!;

	const { decorationTypeFeature } = ThumnailRule;

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

	const designItemStyle = useMemo(
		() => ({ width: 100, height: decorationTypeFeature(decoration).designItemHeight }),
		[decoration, decorationTypeFeature],
	);

	const { onAnimating, animatedStyle } = TCO001UseAnimatedStyle();

	return (
		<TCO001GestureProvider
			initial={decoration.transform}
			onEndGesture={onEndGesture}
			isActive={isActive}
			onSingleTapFinalize={onSingleTapFinalize}
			onAnimating={onAnimating}>
			<Animated.View style={[animatedStyle, viewStyle]}>
				<TMC02302MaskedDecoration
					decorationID={decorationID}
					value={value}
					designItemStyle={designItemStyle}
					onSourceLoad={onSourceLoad}
				/>
			</Animated.View>
		</TCO001GestureProvider>
	);
};
