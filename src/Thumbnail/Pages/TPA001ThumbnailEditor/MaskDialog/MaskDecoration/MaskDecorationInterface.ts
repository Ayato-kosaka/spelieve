import { Decorations } from 'spelieve-common/lib/Models/Thumbnail/TDB02/Decorations';

import { DecorationsMapInterface } from '../../../../Contexts/TCT023DecorationsMap/DecorationsMapInterface';

import { GestureProviderPropsInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';
import { decorationTypeFeature } from '@/Thumbnail/Hooks/ThumbnailRule';

export interface MaskDecorationPropsInterface {
	decoration?: DecorationsMapInterface;
	imageURI?: string;
	maskUri?: string | undefined;
	maskTransform: Decorations['maskTransform'];
	onEndMaskGesture: GestureProviderPropsInterface['onEndGesture'];
	maskItemStyle: ReturnType<typeof decorationTypeFeature>['designItemStyle'];
}
