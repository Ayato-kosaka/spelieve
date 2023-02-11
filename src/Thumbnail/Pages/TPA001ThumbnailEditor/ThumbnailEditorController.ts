import { MediaTypeOptions } from 'expo-image-picker';
import { addDoc, doc, setDoc } from 'firebase/firestore';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { GestureResponderEvent, PressableProps } from 'react-native';
import uuid from 'react-native-uuid';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { CCO006ImagePickerController } from '@/Common/Components/CCO006ImagePicker/ImagePickerController';
import { ImagePickerPropsInterface } from '@/Common/Components/CCO006ImagePicker/ImagePickerPropsInterface';
import { CCO008ViewShot } from '@/Common/Components/CCO008ViewShot/ViewShot';
import i18n from '@/Common/Hooks/i18n-js';
import { ThumbnailStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { storage } from '@/Itinerary/Endpoint/firebaseStorage';
import { TCT011MThumbnailOne } from '@/Thumbnail/Contexts/TCT011MThumbnailOne/ThumbnailOne';
import { TCT023DecorationsMap } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';

export const TPA001ThumbnailEditorController = ({
	navigation,
	route,
}: ThumbnailStackScreenProps<'TPA001ThumbnailEditor'>) => {
	// パラメータ取得
	const { fromThumbnailID } = route.params;

	// グローバルコンテキスト取得
	const { thumbnailItemMapper, setThumbnailItemMapper } = useContext(CCO001ThumbnailEditor);
	const { textList } = thumbnailItemMapper;

	// コンテキスト取得
	const { thumbnail, thumbnailCollectionRef, setThumbnailID } = useContext(TCT011MThumbnailOne);
	const { decorationsMap, setDecorationsMap, getCollection, createDecoration, activeDecorationID, isLoading } =
		useContext(TCT023DecorationsMap);

	const viewShotRef = useRef<CCO008ViewShot>(null);

	const initialDecoration = useMemo(
		() => ({
			translateX: 200,
			translateY: 200,
			rotateZ: 0,
			scale: 1,
		}),
		[],
	); // TODO: 要修正 translateX, translateY は 中央に

	// route.params.fromThumbnailID を監視し、context に渡す
	useEffect(() => {
		setThumbnailID(fromThumbnailID);
		if (!fromThumbnailID) {
			// テンプレート選択に画面遷移
		}
	}, [fromThumbnailID, setThumbnailID]);

	const createThumbnail = useCallback(async () => {
		const tDocRef = await addDoc(thumbnailCollectionRef, {
			...thumbnail,
			imageUrl: 'TODO: 要修正',
			createdAt: new Date(),
		});
		await Promise.all(
			Object.keys(decorationsMap).map(async (decorationID) => {
				const dDocRef = doc(getCollection(tDocRef), decorationID);
				await setDoc(dDocRef, decorationsMap[decorationID]);
			}),
		);
		return tDocRef.id;
	}, [decorationsMap, getCollection, thumbnail, thumbnailCollectionRef]);

	const [dialog, setDialog] = useState<{
		visible: boolean;
		action:
			| Readonly<{
					type: string;
					payload?: object | undefined;
					source?: string | undefined;
					target?: string | undefined;
			  }>
			| undefined;
	}>({ visible: false, action: undefined });
	const hideDialog = useCallback(() => setDialog({ visible: false, action: undefined }), []);
	const onSaveClicked = useCallback(async () => {
		hideDialog();
		// const thumbnailID = await createThumbnail();
		const uri = await viewShotRef?.current?.capture?.();
		thumbnailItemMapper.onBack?.('thumbnailID', uri);
		if (dialog.action) {
			navigation.dispatch(dialog.action);
		}
	}, [dialog.action, hideDialog, navigation, thumbnailItemMapper]);
	const onDiscardClicked = useCallback(() => {
		hideDialog();
		if (dialog.action) {
			navigation.dispatch(dialog.action);
		}
	}, [dialog.action, hideDialog, navigation]);

	// This event is emitted when the user is leaving the screen
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		const unsubscribe = navigation.addListener('beforeRemove', (e) => {
			// if (!hasUnsavedChanges) {
			//   // If we don't have unsaved changes, then we don't need to do anything
			//   return;
			// }

			// Prevent default behavior of leaving the screen
			e.preventDefault();
			setDialog({ visible: true, action: e.data.action });
		});
		return unsubscribe;
	}, [navigation, setThumbnailItemMapper, thumbnail, thumbnailItemMapper]);

	const onPickImage: ImagePickerPropsInterface['onPickImage'] = useCallback(
		(imageUrl, key) => {
			setThumbnailItemMapper((v) => {
				if (!key) {
					key = uuid.v4() as string;
				}
				if (v.storeUrlMap) {
					v.storeUrlMap[key] = imageUrl;
				} else {
					v.storeUrlMap = { [key]: imageUrl };
				}
				return v;
			});
			createDecoration({ ...initialDecoration, decorationType: 'Image', key });
		},
		[createDecoration, initialDecoration, setThumbnailItemMapper],
	);

	const { pickImage } = CCO006ImagePickerController({
		onPickImage,
		imagePickerOptions: {
			allowsEditing: true,
			allowsMultipleSelection: false,
			mediaTypes: MediaTypeOptions.Images,
			quality: 1,
		},
		imageManipulatorActions: [
			{
				resize: {
					width: 900,
				},
			},
		],
		storage,
	});

	const duplicationDecoration = useCallback(() => {
		createDecoration(decorationsMap[activeDecorationID]);
	}, [activeDecorationID, createDecoration, decorationsMap]);

	const bringToFront = useCallback(() => {
		console.log(activeDecorationID);
		setDecorationsMap({
			...decorationsMap,
			[activeDecorationID]: {
				...decorationsMap[activeDecorationID],
				order:
					Object.keys(decorationsMap).reduce(
						(prev, key) => Math.max(prev, decorationsMap[key].order),
						Number.MIN_SAFE_INTEGER,
					) + 1,
			},
		});
	}, [activeDecorationID, decorationsMap, setDecorationsMap]);

	const bringForward = useCallback(() => {
		const targetID =
			Object.keys(decorationsMap)
				.filter((key) => decorationsMap[key].order > decorationsMap[activeDecorationID].order)
				.sort((keyA, keyB) => decorationsMap[keyA].order - decorationsMap[keyB].order)[0] || activeDecorationID;
		setDecorationsMap({
			...decorationsMap,
			[activeDecorationID]: {
				...decorationsMap[activeDecorationID],
				order: decorationsMap[targetID].order,
			},
			[targetID]: {
				...decorationsMap[targetID],
				order: decorationsMap[activeDecorationID].order,
			},
		});
	}, [activeDecorationID, decorationsMap, setDecorationsMap]);

	const sendBackward = useCallback(() => {
		const targetID =
			Object.keys(decorationsMap)
				.filter((key) => decorationsMap[key].order < decorationsMap[activeDecorationID].order)
				.sort((keyA, keyB) => decorationsMap[keyB].order - decorationsMap[keyA].order)[0] || activeDecorationID;
		setDecorationsMap({
			...decorationsMap,
			[activeDecorationID]: {
				...decorationsMap[activeDecorationID],
				order: decorationsMap[targetID].order,
			},
			[targetID]: {
				...decorationsMap[targetID],
				order: decorationsMap[activeDecorationID].order,
			},
		});
	}, [activeDecorationID, decorationsMap, setDecorationsMap]);

	const sendToBack = useCallback(() => {
		setDecorationsMap({
			...decorationsMap,
			[activeDecorationID]: {
				...decorationsMap[activeDecorationID],
				order:
					Object.keys(decorationsMap).reduce(
						(prev, key) => Math.min(prev, decorationsMap[key].order),
						Number.MAX_SAFE_INTEGER,
					) - 1,
			},
		});
	}, [activeDecorationID, decorationsMap, setDecorationsMap]);

	const footerMenuList = [
		{ key: 'Order', title: i18n.t('Order'), icon: 'sort', onPress: () => {} },
		{ key: 'Duplication', title: i18n.t('Duplication'), icon: 'content-copy', onPress: duplicationDecoration },
		{ key: 'Replace', title: i18n.t('Replace'), icon: 'file-replace-outline', onPress: () => {} },
	] as const;

	const [selectedFooterMenu, setSelectedFooterMenu] = useState<(typeof footerMenuList)[number]['key']>(
		footerMenuList[0].key,
	);
	const footerMenuOnPress = useCallback(
		(onPress: PressableProps['onPress'], selected: typeof selectedFooterMenu) => (event: GestureResponderEvent) => {
			setSelectedFooterMenu(selected);
			if (onPress) {
				onPress(event);
			}
		},
		[],
	);
	const headerRightItems = useMemo(
		() =>
			[
				{
					key: 'Text',
					icon: 'text-box-plus',
					onPress: () => createDecoration({ ...initialDecoration, decorationType: 'Text' }),
					show: () => textList !== undefined && textList.length > 0,
				},
				{
					key: 'Image',
					icon: 'image-plus',
					onPress: pickImage,
					show: () => true,
				},
				{
					key: 'Figure',
					icon: 'shape-rectangle-plus',
					onPress: () => createDecoration({ ...initialDecoration, decorationType: 'Figure' }),
					show: () => true,
				},
			] as const,
		[createDecoration, initialDecoration, pickImage, textList],
	);

	return {
		viewShotRef,
		dialog,
		hideDialog,
		onSaveClicked,
		onDiscardClicked,
		footerMenuList,
		selectedFooterMenu,
		footerMenuOnPress,
		headerRightItems,
		bringToFront,
		bringForward,
		sendBackward,
		sendToBack,
	};
};
