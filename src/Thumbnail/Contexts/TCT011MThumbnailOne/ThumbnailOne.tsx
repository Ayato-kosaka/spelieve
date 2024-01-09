import { collection, doc, DocumentReference, getDoc } from 'firebase/firestore';
import { useState, createContext, useEffect, useMemo, ReactNode } from 'react';

import { MThumbnail } from 'spelieve-common/lib/Models/Thumbnail/TDB01/MThumbnail';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import { MThumbnailOneInterface, MThumbnailOneValInterface } from './MThumbnailOneInterface';

import db from '@/Thumbnail/Endpoint/firestore';

export const TCT011MThumbnailOne = createContext({} as MThumbnailOneValInterface);

const initialThumbnail: MThumbnailOneInterface = {
	imageUrl: '',
	aspectRatio: 0,
	prevThumbnailID: undefined,
	attachedCount: 0,
	dummyTextMap: {},
	dummyStoreUrlMap: {},
	createdAt: new Date(),
	updatedAt: new Date(),
};

export const TCT011MThumbnailOneProvider = ({ children }: { children: ReactNode }) => {
	// サムネイルのState
	// MThumbnailOneInterface型のプロパティを持つ
	const [thumbnail, setThumbnail] = useState<MThumbnailOneInterface>({} as MThumbnailOneInterface);
	// サムネイルのDocRefのState()
	const [thumbnailDocRef, setThumbnailDocRef] = useState<DocumentReference<MThumbnailOneInterface> | undefined>();
	const [thumbnailID, setThumbnailID] = useState<string | undefined>();
	// DB読み込み中かどうかを判定する
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const thumbnailCollectionRef = useMemo(
		() =>
			collection(db, MThumbnail.modelName).withConverter(
				FirestoreConverter<MThumbnail, MThumbnailOneInterface>(
					MThumbnail,
					(model) => model,
					(data) => ({
						...data,
					}),
				),
			),
		[],
	);

	// 初期描画時はここが動く
	useEffect(() => {
		if (!thumbnailID) { // IDがない時は、初期状態にする。初めて作った時とか
			setIsLoading(false); // 読み込み中にしない
			setThumbnail(initialThumbnail);
			return;
		}

		// すでにDBに存在する場合（IDあり）
		// 読み込み開始
		setIsLoading(true);

		// データ取得しに行く
		const fetchData = async () => {
			// 1件のサムネイルの「参照データ」を取得
			const docRef = doc(thumbnailCollectionRef, thumbnailID);
			// 1件のサムネイルの「実際のデータ」を取得
			const documentSnapshot = await getDoc(docRef);

			// 実際のデータ取得された
			if (documentSnapshot.exists()) {
				setThumbnailDocRef(docRef);
				setThumbnail({ ...documentSnapshot.data(), prevThumbnailID: thumbnailID });
			}
			// 読み込み終了
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
