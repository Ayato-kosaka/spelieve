export interface ThumbnailEditorValInterface {
	thumbnailItemMapper: ThumbnailItemMapperInterface;
	setThumbnailItemMapper: React.Dispatch<React.SetStateAction<ThumbnailItemMapperInterface>>;
}

export interface ThumbnailItemMapperInterface {
	thumbnailID?: string; // TODO: 消す
	textMap?: {
		[key: string]: string;
	};
	storeUrlMap?: {
		[key: string]: string;
	};
	onBack?: (thumbnailID: string, thumbnailItemMapper: ThumbnailItemMapperInterface, downloadURL?: string) => void;
}
