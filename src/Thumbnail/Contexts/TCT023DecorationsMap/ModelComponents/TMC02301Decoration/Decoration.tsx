import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';

import { TCT023DecorationsMap } from '../../DecorationsMap';
import { TMC02302MaskedDecoration } from '../TMC02302MaskedDecoration/MaskedDecoration';

import { DecorationPropsInterface } from './DecorationInterface';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { TCO001GestureProvider } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProvider';
import { TCO001UseAnimatedStyle } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderController';
import { GestureProviderPropsInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';

export const TMC02301Decoration = ({ decorationID, onLoad, canvasSize }: DecorationPropsInterface) => {
	const { thumbnailItemMapper } = useContext(CCO001ThumbnailEditor);
	const { storeUrlMap, textMap } = thumbnailItemMapper;
	const { decorationsMap, setDecorationsMap, activeDecorationID, setActiveDecorationID } =
		useContext(TCT023DecorationsMap);
	const decoration = decorationsMap[decorationID]!;

	const translateX = useSharedValue(decoration.transform.translateX);
	const translateY = useSharedValue(decoration.transform.translateY);
	const scale = useSharedValue(decoration.transform.scale);
	const rotateZ = useSharedValue(decoration.transform.rotateZ);

	const value = useMemo(() => {
		if (decoration.decorationType === 'Video') {
			return storeUrlMap[decoration.key!];
		}
		if (decoration.decorationType === 'Image') {
			return storeUrlMap[decoration.key!];
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
			if (decoration.decorationType === 'Image') {
				sourceLoadRef.current.isLoading = true;
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
			setDecorationsMap((dm) => {
				const d = dm[decorationID];
				if (!d) return dm;
				return {
					...dm,
					[decorationID]: {
						...d,
						transform: {
							translateX: val.translateX?.value || d.transform.translateX,
							translateY: val.translateY?.value || d.transform.translateY,
							scale: val.scale?.value || d.transform.scale,
							rotateZ: val.rotateZ?.value || d.transform.rotateZ,
						},
					},
				};
			});
		},
		[decorationID, setDecorationsMap],
	);

	const isActive = useMemo(() => activeDecorationID === decorationID, [activeDecorationID, decorationID]);
	const onSingleTapFinalize: GestureProviderPropsInterface['onSingleTapFinalize'] = useCallback(() => {
		setActiveDecorationID(decorationID);
	}, [decorationID, setActiveDecorationID]);

	const maskedDecorationSize = useMemo(
		() => ({
			width: canvasSize.width,
			height: canvasSize.width / decoration.aspectRatio,
		}),
		[canvasSize.width, decoration.aspectRatio],
	);
	const viewStyle: StyleProp<ViewStyle> = useMemo(
		() => ({ zIndex: decoration.order, position: 'absolute', borderWidth: isActive ? 1 : 0 }),
		[decoration.order, isActive],
	);

	const { animatedStyle } = TCO001UseAnimatedStyle({
		gesture: { translateX, translateY, scale, rotateZ },
		canvasSize,
		componentSize: maskedDecorationSize,
	});

	return (
		<TCO001GestureProvider
			gesture={{ translateX, translateY, scale, rotateZ }}
			onEndGesture={onEndGesture}
			isActive={isActive}
			onSingleTapFinalize={onSingleTapFinalize}
			canvasSize={canvasSize}>
			<Animated.View style={[animatedStyle, viewStyle]}>
				<TMC02302MaskedDecoration
					decorationID={decorationID}
					value={value}
					onSourceLoad={onSourceLoad}
					containerSize={maskedDecorationSize}
				/>
			</Animated.View>
		</TCO001GestureProvider>
	);
};
