import { Decorations } from 'spelieve-common/lib/Models/Thumbnail/TDB02/Decorations';

import { DecorationsMapInterface } from '../../../../Contexts/TCT023DecorationsMap/DecorationsMapInterface';

import { GestureProviderPropsInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';

export interface MaskDecorationPropsInterface {
	decoration?: DecorationsMapInterface;
	imageURI?: string;
	maskUri?: string | undefined;
	maskTransform: Decorations['maskTransform'];
	onEndMaskGesture: GestureProviderPropsInterface['onEndGesture'];
}
