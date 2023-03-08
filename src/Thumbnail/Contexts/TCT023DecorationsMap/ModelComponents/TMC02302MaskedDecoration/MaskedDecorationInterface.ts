import { decorationTypeFeature } from '@/Thumbnail/Hooks/ThumbnailRule';

export interface MaskedDecorationPropsInterface {
	decorationID: string;
	value: string | undefined;
	designItemStyle: ReturnType<typeof decorationTypeFeature>['designItemStyle'];
	onSourceLoad: () => void;
}
