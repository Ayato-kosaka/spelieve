import { CollectionReference, DocumentReference } from 'firebase/firestore';

import { MThumbnail } from 'spelieve-common/lib/Models/Thumbnail/TDB01/MThumbnail';

export type MThumbnailOneInterface = MThumbnail;

export interface MThumbnailOneValInterface {
	thumbnail: MThumbnailOneInterface;
	thumbnailCollectionRef: CollectionReference<MThumbnailOneInterface>;
	thumbnailDocRef: DocumentReference<MThumbnailOneInterface> | undefined;
	setThumbnailID: React.Dispatch<React.SetStateAction<string | undefined>>;
	isLoading: boolean;
}
