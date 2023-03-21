import { addDoc, doc, setDoc } from 'firebase/firestore';
import { useCallback, useContext, useRef, useState } from 'react';
import ViewShot from 'react-native-view-shot';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { CHK005StorageUtils } from '@/Common/Hooks/CHK005StorageUtils';
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
	const [onLoadResolveMap, setOnLoadResolveMap] = useState<{ [key: string]: (value: void) => void }>({});

	const createThumbnail = useCallback(
		async (imageUrl: string) => {
			const tDocRef = await addDoc(thumbnailCollectionRef, {
				...thumbnail,
				imageUrl,
				createdAt: new Date(),
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
					const thumbnailID = await createThumbnail(dummyDownloadURL);
					if (downloadURL) {
						thumbnailItemMapper.onBack?.(thumbnailID, thumbnailItemMapper, downloadURL);
					}
				}
				navigation.goBack();
			})
			.catch(() => {});
		setThumbnailItemMapper((value) => ({
			...value,
			storeUrlMap: {},
			textMap: {},
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
