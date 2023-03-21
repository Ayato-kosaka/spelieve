import MaskedView from '@react-native-masked-view/masked-view';
import { Image, View } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';

import { MaskDecorationPropsInterface } from './MaskDecorationInterface';

import { useGetImageRatio } from '@/Common/Hooks/CHK001Utils';
import { TCO001GestureProvider } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProvider';
import { TCO001UseAnimatedStyle } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderController';

export const TPA001MaskDecoration = ({
	decoration,
	imageURI,
	maskUri,
	maskTransform,
	onEndMaskGesture,
	maskItemStyle,
}: MaskDecorationPropsInterface) => {
	const translateX = useSharedValue(maskTransform.translateX);
	const translateY = useSharedValue(maskTransform.translateY);
	const scale = useSharedValue(maskTransform.scale);
	const rotateZ = useSharedValue(maskTransform.rotateZ);

	const { animatedStyle } = TCO001UseAnimatedStyle({ translateX, translateY, scale, rotateZ });

	const { aspectRatio } = useGetImageRatio(imageURI);

	if (!decoration || aspectRatio === 0) {
		return <View />;
	}
	return (
		<TCO001GestureProvider gesture={{ translateX, translateY, scale, rotateZ }} onEndGesture={onEndMaskGesture}>
			<MaskedView
				style={{
					width: '100%',
				}}
				maskElement={
					maskUri ? (
						<Animated.Image
							source={{
								uri: maskUri,
							}}
							style={[
								{
									flex: 1,
								},
								animatedStyle,
							]}
							resizeMode="contain"
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
					<View style={[maskItemStyle, { backgroundColor: decoration.color }]} />
				)}
				{decoration.decorationType === 'Image' && (
					<Image
						source={{
							uri: imageURI,
						}}
						style={[maskItemStyle, { aspectRatio }]}
						resizeMode="cover"
					/>
				)}
			</MaskedView>
		</TCO001GestureProvider>
	);
};
