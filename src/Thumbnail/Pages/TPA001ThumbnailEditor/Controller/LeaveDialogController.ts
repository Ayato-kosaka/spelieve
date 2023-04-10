import { addDoc, doc, setDoc } from 'firebase/firestore';
import { useCallback, useContext, useRef, useState } from 'react';
import ViewShot from 'react-native-view-shot';

import { MThumbnail } from 'spelieve-common/lib/Models/Thumbnail/TDB01/MThumbnail';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { CHK005StorageUtils } from '@/Common/Hooks/CHK005StorageUtils';
import i18n from '@/Common/Hooks/i18n-js';
import { ThumbnailStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { TCT011MThumbnailOne } from '@/Thumbnail/Contexts/TCT011MThumbnailOne/ThumbnailOne';
import { TCT023DecorationsMap } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';
import { storage } from '@/Thumbnail/Endpoint/firebaseStorage';

export const TPA001LeaveDialogController = ({
	navigation,
	route,
}: ThumbnailStackScreenProps<'TPA001ThumbnailEditor'>) => {
	// グローバルコンテキスト取得
	const { thumbnailItemMapper, setThumbnailItemMapper } = useContext(CCO001ThumbnailEditor);

	// コンテキスト取得
	const { thumbnail, thumbnailCollectionRef } = useContext(TCT011MThumbnailOne);
	const { decorationsMap, getCollection, setActiveDecorationID } = useContext(TCT023DecorationsMap);

	const viewShotRef = useRef<ViewShot>(null);
	const [onLoadResolveMap, setOnLoadResolveMap] = useState<{ [key: string]: (resolve: void) => void }>({});

	const createThumbnail = useCallback(
		async (arg: Pick<MThumbnail, 'imageUrl' | 'aspectRatio' | 'dummyTextMap' | 'dummyStoreUrlMap'>) => {
			const tDocRef = await addDoc(thumbnailCollectionRef, {
				...arg,
				prevThumbnailID: thumbnail.prevThumbnailID,
				attachedCount: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			await Promise.all(
				Object.keys(decorationsMap).map((decorationID) => {
					const dDocRef = doc(getCollection(tDocRef), decorationID);
					return setDoc(dDocRef, decorationsMap[decorationID]);
				}),
			);
			return tDocRef.id;
		},
		[decorationsMap, getCollection, thumbnail, thumbnailCollectionRef],
	);

	const [beforeLeaveDialog, setBeforeLeaveDialog] = useState<{
		visible: boolean;
	}>({ visible: false });
	const hideBeforeLeaveDialog = useCallback(() => setBeforeLeaveDialog({ visible: false }), []);
	const onSaveClicked = useCallback(async () => {
		hideBeforeLeaveDialog();

		// 各 Decoraton Component の読み込みが完了したことを示すためのマップを作成する
		let tmpRsolveMap: typeof onLoadResolveMap = {};

		// 各 Decoraton Component の Load を待機する Promise を作成して、tmpRsolveMap に保存する
		const promises = Object.keys(decorationsMap).map(
			(decorationID) =>
				new Promise<void>((resolve, reject) => {
					tmpRsolveMap[decorationID] = resolve;
				}),
		);
		setOnLoadResolveMap(tmpRsolveMap);

		// active による装飾を除去するために、activeDecorationID を初期化します。
		// そして、全ての Decoration コンポーネントが再読込されるまで待機します。
		setActiveDecorationID('');
		await Promise.all(promises);
		const captureURI = await viewShotRef?.current?.capture?.();
		const downloadURL = captureURI && (await CHK005StorageUtils.uploadImageAsync(storage, captureURI));

		// ダミーの内容に変更する
		const decorations = Object.keys(decorationsMap).map((dKey) => decorationsMap[dKey]!);
		const dummyStoreUrlMap = Object.keys(thumbnailItemMapper.storeUrlMap).reduce((prev, key) => {
			if (decorations.some((d) => d.key === key)) {
				prev[key] =
					'https://firebasestorage.googleapis.com/v0/b/itinerary-4aee3.appspot.com/o/MThumbnail%2Feugene-a6jaMBfDeoo-unsplash.jpg?alt=media&token=b137c75a-3ec4-49c1-85b6-3d993e3b6d2c';
			}
			return prev;
		}, {} as typeof thumbnailItemMapper.storeUrlMap);
		const dummyTextMap = Object.keys(thumbnailItemMapper.textMap).reduce((prev, key) => {
			if (decorations.some((d) => d.key === key)) {
				prev[key] = i18n.t('Dummy Text');
			}
			return prev;
		}, {} as typeof thumbnailItemMapper.textMap);

		// 各 Decoraton Component の Load を待機する Promise を作成して、tmpRsolveMap に保存する
		tmpRsolveMap = {};
		Promise.all(
			Object.keys(decorationsMap).map(
				(decorationID) =>
					new Promise<void>((resolve, reject) => {
						tmpRsolveMap[decorationID] = resolve;
					}),
			),
		)
			.then(async () => {
				const dummyCaptureURI = await viewShotRef?.current?.capture?.();
				const dummyDownloadURL =
					dummyCaptureURI && (await CHK005StorageUtils.uploadImageAsync(storage, dummyCaptureURI));
				if (dummyDownloadURL) {
					const thumbnailID = await createThumbnail({
						imageUrl: dummyDownloadURL,
						aspectRatio: thumbnailItemMapper.aspectRatio,
						dummyStoreUrlMap,
						dummyTextMap,
					});
					if (downloadURL) {
						thumbnailItemMapper.onBack?.(thumbnailID, thumbnailItemMapper, downloadURL);
					}
				}
				navigation.goBack();
			})
			.catch(() => {});
		setThumbnailItemMapper((value) => ({
			...value,
			storeUrlMap: dummyStoreUrlMap,
			textMap: dummyTextMap,
		}));
		setOnLoadResolveMap(tmpRsolveMap);
	}, [
		createThumbnail,
		decorationsMap,
		hideBeforeLeaveDialog,
		navigation,
		setActiveDecorationID,
		setThumbnailItemMapper,
		thumbnailItemMapper,
	]);
	const onDiscardClicked = useCallback(() => {
		hideBeforeLeaveDialog();
		navigation.goBack();
	}, [hideBeforeLeaveDialog, navigation]);

	const onLeaveScreen = useCallback(() => {
		// TODO: change を検知し、ダイアログの表示を制御する
		// if (!hasUnsavedChanges) {
		//   // If we don't have unsaved changes, then we don't need to do anything
		//   return;
		// }

		setBeforeLeaveDialog({ visible: true });
	}, []);

	return {
		viewShotRef,
		onLoadResolveMap,
		beforeLeaveDialog,
		hideBeforeLeaveDialog,
		onLeaveScreen,
		onSaveClicked,
		onDiscardClicked,
	};
};
