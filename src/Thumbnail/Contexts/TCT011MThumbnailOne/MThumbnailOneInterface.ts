import { CollectionReference, DocumentReference } from 'firebase/firestore';

import { MThumbnail } from 'spelieve-common/lib/Models/Thumbnail/TDB01/MThumbnail';

import { Weaken } from '@/Common/Hooks/CHK003TypeScript';

export interface MThumbnailOneInterface extends Weaken<MThumbnail, 'backgroundItemType'> {
	backgroundItemType: 'Video' | 'Image' | 'Figure';
}

export interface MThumbnailOneValInterface {
	thumbnail: MThumbnailOneInterface;
	thumbnailCollectionRef: CollectionReference<MThumbnailOneInterface>;
	thumbnailDocRef: DocumentReference<MThumbnailOneInterface> | undefined;
	setThumbnailID: React.Dispatch<React.SetStateAction<string | undefined>>;
	isLoading: boolean;
}
