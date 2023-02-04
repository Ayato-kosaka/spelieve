export interface ThumbnailEditorValInterface {
	thumbnailItemMapper: ThumbnailItemMapperInterface;
	setThumbnailItemMapper: React.Dispatch<React.SetStateAction<ThumbnailItemMapperInterface>>;
}

export interface ThumbnailItemMapperInterface {
	textList?: {
		key: string;
		name: string;
		val: string;
	}[];
	storeUrlMap?: {
		[key: string]: string;
	};
}
