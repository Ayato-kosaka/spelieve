import { QueryDocumentSnapshot } from 'firebase/firestore';

import { MMaskShape } from 'spelieve-common/lib/Models/Thumbnail/TDB03/MMaskShape';

export type MMaskShapeListInterface = MMaskShape;

export interface MMaskShapeListValInterface {
	maskShapeList: QueryDocumentSnapshot<MMaskShapeListInterface>[];
	isLoading: boolean;
}
