import MaskedView from '@react-native-masked-view/masked-view';
import { Image, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { MaskDecorationPropsInterface } from './MaskDecorationInterface';

import { TCO001GestureProvider } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProvider';
import { TCO001UseAnimatedStyle } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderController';

export const TPA001MaskDecoration = ({ decoration, imageURI, onEndMaskGesture }: MaskDecorationPropsInterface) => {
	const { onAnimating, animatedStyle } = TCO001UseAnimatedStyle();

	if (!decoration) {
		return <View />;
	}
	return (
		<TCO001GestureProvider onEndGesture={onEndMaskGesture} onAnimating={onAnimating}>
			<MaskedView
				style={{
					width: '100%',
					aspectRatio: 1,
				}}
				maskElement={
					<Animated.Image
						source={{
							uri:
								decoration.maskUri ??
								// TODO: 後で変える
								'https://cdn-icons-png.flaticon.com/512/2107/2107776.png',
						}}
						style={[
							{
								flex: 1,
							},
							animatedStyle,
						]}
						resizeMode="cover"
					/>
				}>
				<Image
					source={{
						uri:
							imageURI ??
							// TODO: 後で変える
							'https://firebasestorage.googleapis.com/v0/b/spelieve-dev.appspot.com/o/12373bcd-013b-43d3-bbcf-f95c3d991edc?alt=media&token=91171ed7-7a92-439b-9c4b-a675cabe49bc',
					}}
					style={{
						flex: 1,
					}}
					resizeMode="cover"
				/>
			</MaskedView>
		</TCO001GestureProvider>
	);
};
