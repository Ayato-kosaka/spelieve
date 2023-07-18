import { QueryDocumentSnapshot } from 'firebase/firestore';

import { MThumbnail } from 'spelieve-common/lib/Models/Thumbnail/TDB01/MThumbnail';

export type MThumbnailListInterface = MThumbnail;
export interface MThumbnailListValInterface {
	thumbnailList: QueryDocumentSnapshot<MThumbnail>[];
	isLoading: boolean;
}
