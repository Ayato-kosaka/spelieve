import { MThumbnail } from 'spelieve-common/lib/Models/Thumbnail/TDB01/MThumbnail';

import { Weaken } from '@/Common/Hooks/CHK003TypeScript';

export interface MThumbnailOneInteface extends Weaken<MThumbnail, 'backgroundItemType'> {
	backgroundItemType: 'Video' | 'Image' | 'Figure';
}

export interface MThumbnailOneValInteface {
	thumbnail: MThumbnailOneInteface | undefined;
	setThumbnailID: React.Dispatch<React.SetStateAction<string | undefined>>;
	isLoading: boolean;
}
