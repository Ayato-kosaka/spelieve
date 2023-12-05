import { addDoc, doc, setDoc } from 'firebase/firestore';
import { useCallback, useContext, useRef, useState } from 'react';
import ViewShot from 'react-native-view-shot';

import { MThumbnail } from 'spelieve-common/lib/Models/Thumbnail/TDB01/MThumbnail';

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
	const { thumbnailItemMapper } = useContext(CCO001ThumbnailEditor);

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

		// active による装飾を除去するために、activeDecorationID を初期化します。
		// そして、全ての Decoration コンポーネントが再読込されるまで待機します。
		setActiveDecorationID('');
		const captureURI = await viewShotRef?.current?.capture?.();
		const downloadURL = captureURI && (await CHK005StorageUtils.uploadImageAsync(storage, captureURI));

		if (downloadURL) {
			const thumbnailID = await createThumbnail({
				imageUrl: '',
				aspectRatio: thumbnailItemMapper.aspectRatio,
				dummyStoreUrlMap: {},
				dummyTextMap: {},
			});
			thumbnailItemMapper.onBack?.(thumbnailID, thumbnailItemMapper, downloadURL);
		}
		navigation.goBack();
	}, [createThumbnail, hideBeforeLeaveDialog, navigation, setActiveDecorationID, thumbnailItemMapper]);
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
