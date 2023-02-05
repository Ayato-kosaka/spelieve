import { collection, getDocs } from 'firebase/firestore';
import { useState, createContext, useEffect, useMemo, ReactNode, useCallback, useContext } from 'react';
import uuid from 'react-native-uuid';

import { Decorations } from 'spelieve-common/lib/Models/Thumbnail/TDB02/Decorations';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

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

	useEffect(() => {
		if (mThumbnailOneIsLoading || !thumbnailDocRef) {
			setIsLoading(false);
			setDecorationsMap({});
			return;
		}
		setIsLoading(true);

		const fetchData = async () => {
			const collectionRef = collection(thumbnailDocRef, Decorations.modelName).withConverter(firestoreConverter);
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
	}, [firestoreConverter, mThumbnailOneIsLoading, thumbnailDocRef]);

	const createDecoration: DecorationsMapValInterface['createDecoration'] = useCallback(
		(data) => {
			const id = uuid.v4() as unknown as string;
			setDecorationsMap({
				...decorationsMap,
				[id]: {
					...data,
					color: `#${Math.floor(Math.random() * 16777215)
						.toString(16)
						.padStart(6, '0')}`,
					order:
						Object.keys(decorationsMap).reduce(
							(prev, key) => Math.max(prev, decorationsMap[key].order),
							Number.MIN_SAFE_INTEGER,
						) + 1,
				},
			});
		},
		[decorationsMap],
	);

	const [activeDecorationID, setActiveDecorationID] = useState<string>('');

	const value = useMemo(
		() => ({
			decorationsMap,
			setDecorationsMap,
			createDecoration,
			activeDecorationID,
			setActiveDecorationID,
			isLoading,
		}),
		[activeDecorationID, createDecoration, decorationsMap, isLoading],
	);

	return <TCT023DecorationsMap.Provider value={value}>{children}</TCT023DecorationsMap.Provider>;
};
