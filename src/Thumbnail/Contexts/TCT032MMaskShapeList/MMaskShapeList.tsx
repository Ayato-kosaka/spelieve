import { collection, getDocs } from 'firebase/firestore';
import { useState, createContext, useEffect, useMemo, ReactNode } from 'react';

import { MMaskShape } from 'spelieve-common/lib/Models/Thumbnail/TDB03/MMaskShape';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import { MMaskShapeListInterface, MMaskShapeListValInterface } from './MMaskShapeListInterface';

import db from '@/Thumbnail/Endpoint/firestore';

export const TCT032MMaskShapeList = createContext({} as MMaskShapeListValInterface);

export const TCT032MMaskShapeListProvider = ({ children }: { children: ReactNode }) => {
	const [maskShapeList, setMaskShapeList] = useState<MMaskShapeListValInterface['maskShapeList']>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const maskShapeCollectionRef = useMemo(
		() =>
			collection(db, MMaskShape.modelName).withConverter(
				FirestoreConverter<MMaskShapeListInterface, MMaskShapeListInterface>(
					MMaskShape,
					(model) => model,
					(data) => data,
				),
			),
		[],
	);

	useEffect(() => {
		setIsLoading(true);

		const fetchData = async () => {
			const querySnapshot = await getDocs(maskShapeCollectionRef);
			setMaskShapeList(querySnapshot.docs.map((doc) => doc));
			setIsLoading(false);
		};

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetchData();
	}, [maskShapeCollectionRef]);

	const value = useMemo(
		() => ({
			maskShapeList,
			isLoading,
		}),
		[isLoading, maskShapeList],
	);
	return <TCT032MMaskShapeList.Provider value={value}>{children}</TCT032MMaskShapeList.Provider>;
};
