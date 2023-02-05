import { collection, doc, DocumentReference, getDoc } from 'firebase/firestore';
import { useState, createContext, useEffect, useMemo, ReactNode } from 'react';

import { MThumbnail } from 'spelieve-common/lib/Models/Thumbnail/TDB01/MThumbnail';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import { MThumbnailOneInterface, MThumbnailOneValInterface } from './MThumbnailOneInterface';

import db from '@/Thumbnail/Endpoint/firestore';

export const TCT011MThumbnailOne = createContext({} as MThumbnailOneValInterface);

const initialThumbnail: MThumbnailOneInterface = {
	backgroundItemType: 'Figure',
	copied_count: 0,
	imageUrl: '',
	createdAt: new Date(),
	updatedAt: new Date(),
};

export const TCT011MThumbnailOneProvider = ({ children }: { children: ReactNode }) => {
	const [thumbnail, setThumbnail] = useState<MThumbnailOneInterface>({} as MThumbnailOneInterface);
	const [thumbnailDocRef, setThumbnailDocRef] = useState<DocumentReference<MThumbnailOneInterface> | undefined>();
	const [thumbnailID, setThumbnailID] = useState<string | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const thumbnailCollectionRef = useMemo(
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
					(data) => {
						const copiedCount = 0;
						return {
							...data,
							copied_count: copiedCount,
						};
					},
				),
			),
		[],
	);

	useEffect(() => {
		if (!thumbnailID) {
			setIsLoading(false);
			setThumbnail(initialThumbnail);
			return;
		}
		setIsLoading(true);

		const fetchData = async () => {
			const docRef = doc(thumbnailCollectionRef, thumbnailID);
			const documentSnapshot = await getDoc(docRef);
			if (documentSnapshot.exists()) {
				setThumbnailDocRef(docRef);
				setThumbnail(documentSnapshot.data());
			}
			setIsLoading(false);
		};

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetchData();
	}, [thumbnailCollectionRef, thumbnailID]);

	const value = useMemo(
		() => ({
			thumbnail,
			thumbnailCollectionRef,
			thumbnailDocRef,
			setThumbnailID,
			isLoading,
		}),
		[isLoading, thumbnail, thumbnailCollectionRef, thumbnailDocRef],
	);
	return <TCT011MThumbnailOne.Provider value={value}>{children}</TCT011MThumbnailOne.Provider>;
};
