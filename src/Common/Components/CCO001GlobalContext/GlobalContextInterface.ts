export interface ThumbnailEditorValInterface {
	thumbnailItemMapper: ThumbnailItemMapperInterface;
	setThumbnailItemMapper: React.Dispatch<React.SetStateAction<ThumbnailItemMapperInterface>>;
}

export interface ThumbnailItemMapperInterface {
	thumbnailID?: string;
	textList?: {
		key: string;
		name: string;
		val: string;
	}[];
	storeUrlMap?: {
		[key: string]: string;
	};
}
