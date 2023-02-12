export interface ThumbnailEditorValInterface {
	thumbnailItemMapper: ThumbnailItemMapperInterface;
	setThumbnailItemMapper: React.Dispatch<React.SetStateAction<ThumbnailItemMapperInterface>>;
}

export interface ThumbnailItemMapperInterface {
	textMap: {
		[key: string]: string;
	};
	storeUrlMap: {
		[key: string]: string;
	};
	onBack?: (thumbnailID: string, thumbnailItemMapper: ThumbnailItemMapperInterface, downloadURL?: string) => void;
}
