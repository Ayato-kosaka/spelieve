import { DecorationsMapInterface } from '../../../Contexts/TCT023DecorationsMap/DecorationsMapInterface';

import { GestureProviderPropsInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';

export interface MaskDecorationPropsInterface {
	decoration?: DecorationsMapInterface;
	imageURI?: string;
	onEndMaskGesture: GestureProviderPropsInterface['onEndGesture'];
}
