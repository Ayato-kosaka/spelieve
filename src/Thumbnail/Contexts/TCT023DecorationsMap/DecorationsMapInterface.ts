import { Decorations } from 'spelieve-common/lib/Models/Thumbnail/TDB02/Decorations';

import { Weaken } from '@/Common/Hooks/CHK003TypeScript';

export interface DecorationsMapInterface extends Weaken<Decorations, 'decorationType'> {
	decorationType: 'Video' | 'Image' | 'Figure' | 'Text';
}
export interface DecorationsMapValInterface {
	decorationsMap: {
		[key: string]: DecorationsMapInterface;
	};
	setDecorationsMap: React.Dispatch<
		React.SetStateAction<{
			[key: string]: DecorationsMapInterface;
		}>
	>;
	createDecoration: (data: Omit<DecorationsMapInterface, 'color' | 'order'>) => void;
	activeDecorationID: string;
	setActiveDecorationID: React.Dispatch<React.SetStateAction<string>>;
	isLoading: boolean;
}
