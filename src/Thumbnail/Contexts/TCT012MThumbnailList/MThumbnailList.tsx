import { collection, getDocs } from 'firebase/firestore';
import { useState, createContext, useEffect, useMemo, ReactNode } from 'react';

import { MThumbnail } from 'spelieve-common/lib/Models/Thumbnail/TDB01/MThumbnail';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import { MThumbnailListInterface, MThumbnailListValInterface } from './MThumbnailListInterface';

import db from '@/Thumbnail/Endpoint/firestore';

export const TCT012MThumbnailList = createContext({} as MThumbnailListValInterface);

export const TCT012MThumbnailListProvider = ({ children }: { children: ReactNode }) => {
	const [thumbnailList, setThumbnailList] = useState<MThumbnailListValInterface['thumbnailList']>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const thumbnailCollectionRef = useMemo(
		() =>
			collection(db, MThumbnail.modelName).withConverter(
				FirestoreConverter<MThumbnail, MThumbnailListInterface>(
					MThumbnail,
					(model) => model,
					(data) => data,
				),
			),
		[],
	);

	useEffect(() => {
		setIsLoading(true);

		const fetchData = async () => {
			const querySnapshot = await getDocs(thumbnailCollectionRef);
			setThumbnailList(querySnapshot.docs.map((doc) => doc));
			setIsLoading(false);
		};

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetchData();
	}, [thumbnailCollectionRef]);

	const value = useMemo(
		() => ({
			thumbnailList,
			isLoading,
		}),
		[isLoading, thumbnailList],
	);
	return <TCT012MThumbnailList.Provider value={value}>{children}</TCT012MThumbnailList.Provider>;
};
