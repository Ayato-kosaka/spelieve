import { memo, createContext, ReactNode, useMemo, useState } from 'react';

import { ThumbnailEditorValInterface, ThumbnailItemMapperInterface } from './GlobalContextInterface';

export const CCO001ThumbnailEditor = createContext({} as ThumbnailEditorValInterface);

const CCO001ThumbnailEditorProvider = ({ children }: { children: ReactNode }) => {
	const [thumbnailItemMapper, setThumbnailItemMapper] = useState<ThumbnailItemMapperInterface>({
		aspectRatio: 1,
		textMap: {},
		storeUrlMap: {},
	});
	const value = useMemo(
		() => ({
			thumbnailItemMapper,
			setThumbnailItemMapper,
		}),
		[thumbnailItemMapper],
	);
	return <CCO001ThumbnailEditor.Provider value={value}>{children}</CCO001ThumbnailEditor.Provider>;
};

export const CCO001GlobalContext = ({ children }: { children: ReactNode }) => {
	const MemoThumbnailEditorProvider = memo(CCO001ThumbnailEditorProvider);
	return <MemoThumbnailEditorProvider>{children}</MemoThumbnailEditorProvider>;
};
