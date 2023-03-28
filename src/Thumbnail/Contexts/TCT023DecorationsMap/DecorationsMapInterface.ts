import { CollectionReference, DocumentReference } from 'firebase/firestore';

import { Decorations } from 'spelieve-common/lib/Models/Thumbnail/TDB02/Decorations';

import { MThumbnailOneInterface } from '../TCT011MThumbnailOne/MThumbnailOneInterface';

import { Weaken } from '@/Common/Hooks/CHK003TypeScript';

export interface DecorationsMapInterface extends Weaken<Decorations, 'decorationType'> {
	decorationType: 'Video' | 'Image' | 'Figure' | 'Text';
}
export interface DecorationsMapValInterface {
	decorationsMap: {
		[key: string]: DecorationsMapInterface | undefined;
	};
	setDecorationsMap: React.Dispatch<
		React.SetStateAction<{
			[key: string]: DecorationsMapInterface | undefined;
		}>
	>;
	getCollection: (
		parentDocRef: DocumentReference<MThumbnailOneInterface>,
	) => CollectionReference<DecorationsMapInterface>;
	createDecoration: (data: Omit<DecorationsMapInterface, 'order' | 'createdAt' | 'updatedAt'>) => void;
	activeDecorationID: string;
	setActiveDecorationID: React.Dispatch<React.SetStateAction<string>>;
	isLoading: boolean;
}
