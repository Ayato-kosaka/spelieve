import { useCallback, useContext, useMemo } from 'react';
import { Image, StyleProp, ViewStyle, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { TCT023DecorationsMap } from '../../DecorationsMap';

import { DecorationPropsInterface } from './DecorationInterface';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { TCO001GestureProvider } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProvider';
import { GestureProviderPropsInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';

export const TMC02301Decoration = ({ decorationID }: DecorationPropsInterface) => {
	const { thumbnailItemMapper } = useContext(CCO001ThumbnailEditor);
	const { storeUrlMap, textMap } = thumbnailItemMapper;
	const { decorationsMap, setDecorationsMap, activeDecorationID, setActiveDecorationID } =
		useContext(TCT023DecorationsMap);
	const decoration = decorationsMap[decorationID];
	console.log('decoration', decorationID);

	const onEndGesture: GestureProviderPropsInterface['onEndGesture'] = useCallback(
		(val) => {
			console.log('decorationsMap', decorationsMap);
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
			{decoration.decorationType === 'Image' && storeUrlMap && decoration.key && storeUrlMap[decoration.key] && (
				<Image style={styles.designItemStyle} source={{ uri: storeUrlMap[decoration.key] }} />
			)}
			{decoration.decorationType === 'Text' && textMap && decoration.key && textMap[decoration.key] && (
				<Text>{textMap[decoration.key]}</Text>
			)}
		</TCO001GestureProvider>
	);
};
