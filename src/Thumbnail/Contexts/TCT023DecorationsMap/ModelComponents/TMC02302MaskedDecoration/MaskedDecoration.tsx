import MaskedView from '@react-native-masked-view/masked-view';
import { useContext, useMemo } from 'react';
import { Image, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated from 'react-native-reanimated';

import { TCT023DecorationsMap } from '../../DecorationsMap';

import { MaskedDecorationPropsInterface } from './MaskedDecorationInterface';

import { useGetImageRatio } from '@/Common/Hooks/CHK001Utils';

export const TMC02302MaskedDecoration = ({
	decorationID,
	value,
	designItemStyle,
	onSourceLoad,
}: MaskedDecorationPropsInterface) => {
	const { decorationsMap } = useContext(TCT023DecorationsMap);
	const decoration = decorationsMap[decorationID];
	const transform = useMemo(
		() =>
			decoration?.maskTransform
				? [
						{
							translateX: decoration.maskTransform.translateX,
						},
						{
							translateY: decoration.maskTransform.translateY,
						},
						{ scale: decoration.maskTransform.scale },
						{ rotateZ: `${(decoration.maskTransform.rotateZ / Math.PI) * 180}deg` },
				  ]
				: [],
		[decoration?.maskTransform],
	);

	const { aspectRatio } = useGetImageRatio(value);

	if (!decoration) {
		return <View />;
	}
	return (
		<MaskedView
			style={{
				width: '100%',
				height: '100%',
			}}
			maskElement={
				decoration.maskUri ? (
					<Animated.Image
						source={{
							uri: decoration.maskUri,
						}}
						style={[
							{
								flex: 1,
								transform,
							},
						]}
						resizeMode="cover"
					/>
				) : (
					<View
						style={{
							backgroundColor: 'black',
							flex: 1,
						}}
					/>
				)
			}>
			{decoration.decorationType === 'Figure' && (
				<View style={[designItemStyle, { backgroundColor: decoration.color }]} />
			)}
			{decoration.decorationType === 'Image' && value && (
				<Image
					style={[designItemStyle, { aspectRatio }]}
					source={{
						uri: value,
					}}
					onLoad={onSourceLoad}
					resizeMode="cover"
				/>
			)}
			{decoration.decorationType === 'Text' && decoration.key && <Text>{value || 'Dummy Text'}</Text>}
		</MaskedView>
	);
};
