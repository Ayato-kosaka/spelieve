import { collection, doc, getDoc } from 'firebase/firestore';
import { useState, createContext, useEffect, useMemo, ReactNode } from 'react';

import { MThumbnail } from 'spelieve-common/lib/Models/Thumbnail/TDB01/MThumbnail';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import { MThumbnailOneInteface, MThumbnailOneValInteface } from './MThumbnailOneInterface';

import db from '@/Place/Endpoint/firestore';

export const TCT011MThumbnailOne = createContext({} as MThumbnailOneValInteface);

export const TCT011MThumbnailOneProvider = ({ children }: { children: ReactNode }) => {
	const [thumbnail, setThumbnail] = useState<MThumbnailOneInteface | undefined>();
	const [thumbnailID, setThumbnailID] = useState<string | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const collectionRef = useMemo(
		() =>
			collection(db, MThumbnail.modelName).withConverter(
				FirestoreConverter<MThumbnail, MThumbnailOneInteface>(
					MThumbnail,
					(model) => {
						const backgroundItemType = model.backgroundItemType as MThumbnailOneInteface['backgroundItemType'];
						return {
							...model,
							backgroundItemType,
						};
					},
					(data) => data,
				),
			),
		[],
	);

	useEffect(() => {
		if (!thumbnailID) {
			setThumbnail(undefined); // TODO 要検討
			return;
		}
		setIsLoading(true);

		const fetchData = async () => {
			const documentSnapshot = await getDoc(doc(collectionRef, thumbnailID));
			setThumbnail(documentSnapshot.data());
			setIsLoading(false);
		};

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetchData();
	}, [collectionRef, thumbnailID]);

	const value = useMemo(
		() => ({
			thumbnail,
			setThumbnailID,
			isLoading,
		}),
		[isLoading, thumbnail],
	);
	return <TCT011MThumbnailOne.Provider value={value}>{children}</TCT011MThumbnailOne.Provider>;
};
