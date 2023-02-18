import { useCallback, useContext, useEffect, useMemo } from 'react';
import { Image, StyleProp, ViewStyle, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { TCT023DecorationsMap } from '../../DecorationsMap';

import { DecorationPropsInterface } from './DecorationInterface';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { TCO001GestureProvider } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProvider';
import { GestureProviderPropsInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';

export const TMC02301Decoration = ({ decorationID, onLoad }: DecorationPropsInterface) => {
	const { thumbnailItemMapper } = useContext(CCO001ThumbnailEditor);
	const { storeUrlMap, textMap } = thumbnailItemMapper;
	const { decorationsMap, setDecorationsMap, activeDecorationID, setActiveDecorationID } =
		useContext(TCT023DecorationsMap);
	const decoration = decorationsMap[decorationID]!;
	console.log('decoration', decorationID);

	const value = useMemo(() => {
		if (decoration.decorationType === 'Video' || decoration.decorationType === 'Image') {
			return storeUrlMap[decoration.key!];
		}
		if (decoration.decorationType === 'Text') {
			return textMap[decoration.key!];
		}
		return undefined;
	}, [decoration.decorationType, decoration.key, storeUrlMap, textMap]);

	useEffect(() => {
		if (decoration.decorationType === 'Video' || decoration.decorationType === 'Image') {
			return;
		}
		onLoad?.(true);
	}, [decoration.decorationType, onLoad]);

	const onImageLoad = useCallback(() => {
		onLoad?.(true);
	}, [onLoad]);

	const onEndGesture: GestureProviderPropsInterface['onEndGesture'] = useCallback(
		(val) => {
			console.log('decorationsMap', decorationsMap);
			setDecorationsMap({
				...decorationsMap,
				[decorationID]: {
					...decoration,
					...val,
				},
			});
		},
		[decoration, decorationID, decorationsMap, setDecorationsMap],
	);

	const isActive = useMemo(() => activeDecorationID === decorationID, [activeDecorationID, decorationID]);
	const onSingleTapFinalize: GestureProviderPropsInterface['onSingleTapFinalize'] = useCallback(
		(event, success) => {
			setActiveDecorationID(decorationID);
		},
		[decorationID, setActiveDecorationID],
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
				<Image
					style={styles.designItemStyle}
					source={{
						uri: value || 'https://thumb.photo-ac.com/15/1527a37a819426cf6ac7a8761eb4bf67_t.jpeg',
					}}
					onLoad={onImageLoad}
				/>
			)}
			{decoration.decorationType === 'Text' && decoration.key && <Text>{value || 'Dummy Text'}</Text>}
		</TCO001GestureProvider>
	);
};
