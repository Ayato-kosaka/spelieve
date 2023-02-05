import { collection, doc, DocumentReference, getDoc } from 'firebase/firestore';
import { useState, createContext, useEffect, useMemo, ReactNode } from 'react';

import { MThumbnail } from 'spelieve-common/lib/Models/Thumbnail/TDB01/MThumbnail';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import { MThumbnailOneInterface, MThumbnailOneValInterface } from './MThumbnailOneInterface';

import db from '@/Place/Endpoint/firestore';

export const TCT011MThumbnailOne = createContext({} as MThumbnailOneValInterface);

export const TCT011MThumbnailOneProvider = ({ children }: { children: ReactNode }) => {
	const [thumbnail, setThumbnail] = useState<MThumbnailOneInterface | undefined>();
	const [thumbnailDocRef, setThumbnailDocRef] = useState<DocumentReference<MThumbnailOneInterface> | undefined>();
	const [thumbnailID, setThumbnailID] = useState<string | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const collectionRef = useMemo(
		() =>
			collection(db, MThumbnail.modelName).withConverter(
				FirestoreConverter<MThumbnail, MThumbnailOneInterface>(
					MThumbnail,
					(model) => {
						const backgroundItemType = model.backgroundItemType as MThumbnailOneInterface['backgroundItemType'];
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
			setIsLoading(false);
			setThumbnail(undefined); // TODO 要初期化
			return;
		}
		setIsLoading(true);

		const fetchData = async () => {
			const docRef = doc(collectionRef, thumbnailID);
			const documentSnapshot = await getDoc(docRef);
			setThumbnailDocRef(docRef);
			setThumbnail(documentSnapshot.data());
			setIsLoading(false);
		};

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetchData();
	}, [collectionRef, thumbnailID]);

	const value = useMemo(
		() => ({
			thumbnail,
			thumbnailDocRef,
			setThumbnailID,
			isLoading,
		}),
		[isLoading, thumbnail, thumbnailDocRef],
	);
	return <TCT011MThumbnailOne.Provider value={value}>{children}</TCT011MThumbnailOne.Provider>;
};
