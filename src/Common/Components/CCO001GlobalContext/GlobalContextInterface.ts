export interface ThumbnailEditorValInterface {
	thumbnailItemMapper: ThumbnailItemMapperInterface;
	setThumbnailItemMapper: React.Dispatch<React.SetStateAction<ThumbnailItemMapperInterface>>;
}

export interface ThumbnailItemMapperInterface {
	thumbnailID?: string; // TODO: 消す
	textList?: {
		key: string;
		name: string;
		val: string;
	}[];
	storeUrlMap?: {
		[key: string]: string;
	};
	onBack?: (thumbnailID: string, uri?: string) => void;
}
