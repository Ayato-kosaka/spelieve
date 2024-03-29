import { collection, DocumentReference, getDocs } from 'firebase/firestore';
import { useState, createContext, useEffect, useMemo, ReactNode, useCallback, useContext } from 'react';
import uuid from 'react-native-uuid';

import { Decorations } from 'spelieve-common/lib/Models/Thumbnail/TDB02/Decorations';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import { MThumbnailOneInterface } from '../TCT011MThumbnailOne/MThumbnailOneInterface';
import { TCT011MThumbnailOne } from '../TCT011MThumbnailOne/ThumbnailOne';

import { DecorationsMapInterface, DecorationsMapValInterface } from './DecorationsMapInterface';

export const TCT023DecorationsMap = createContext({} as DecorationsMapValInterface);

export const TCT023DecorationsMapProvider = ({ children }: { children: ReactNode }) => {
	const [decorationsMap, setDecorationsMap] = useState<DecorationsMapValInterface['decorationsMap']>({});
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const { thumbnailDocRef, isLoading: mThumbnailOneIsLoading } = useContext(TCT011MThumbnailOne);

	const firestoreConverter = useMemo(
		() =>
			FirestoreConverter<Decorations, DecorationsMapInterface>(
				Decorations,
				(model) => {
					const decorationType = model.decorationType as DecorationsMapInterface['decorationType'];
					return {
						...model,
						decorationType,
					};
				},
				(data) => data,
			),
		[],
	);

	const getCollection = useCallback(
		(parentDocRef: DocumentReference<MThumbnailOneInterface>) =>
			collection(parentDocRef, Decorations.modelName).withConverter(firestoreConverter),
		[firestoreConverter],
	);

	useEffect(() => {
		if (mThumbnailOneIsLoading || !thumbnailDocRef) {
			setIsLoading(false);
			setDecorationsMap({});
			return;
		}
		setIsLoading(true);

		const fetchData = async () => {
			const collectionRef = getCollection(thumbnailDocRef);
			const querySnapshot = await getDocs(collectionRef);
			setDecorationsMap(
				querySnapshot.docs.reduce((prev, docSnap) => {
					prev[docSnap.id] = docSnap.data();
					return prev;
				}, {} as DecorationsMapValInterface['decorationsMap']),
			);
			setIsLoading(false);
		};

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetchData();
	}, [firestoreConverter, getCollection, mThumbnailOneIsLoading, thumbnailDocRef]);

	const [activeDecorationID, setActiveDecorationID] = useState<string>('');

	const createDecoration: DecorationsMapValInterface['createDecoration'] = useCallback((data) => {
		const id = uuid.v4() as unknown as string;
		setDecorationsMap((v) => ({
			...v,
			[id]: {
				...data,
				order:
					Object.keys(v).length > 0
						? Object.keys(v).reduce((prev, key) => Math.max(prev, v[key]!.order), Number.MIN_SAFE_INTEGER) + 1
						: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		}));
		setActiveDecorationID(id);
	}, []);

	const value = useMemo(
		() => ({
			decorationsMap,
			setDecorationsMap,
			getCollection,
			createDecoration,
			activeDecorationID,
			setActiveDecorationID,
			isLoading,
		}),
		[activeDecorationID, createDecoration, decorationsMap, getCollection, isLoading],
	);

	return <TCT023DecorationsMap.Provider value={value}>{children}</TCT023DecorationsMap.Provider>;
};
