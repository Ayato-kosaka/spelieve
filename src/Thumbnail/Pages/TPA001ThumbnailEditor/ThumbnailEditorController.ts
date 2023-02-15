import { MediaTypeOptions } from 'expo-image-picker';
import { addDoc, doc, setDoc } from 'firebase/firestore';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { GestureResponderEvent, PressableProps } from 'react-native';
import uuid from 'react-native-uuid';
import ViewShot from 'react-native-view-shot';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { CCO006ImagePickerController } from '@/Common/Components/CCO006ImagePicker/ImagePickerController';
import { ImagePickerPropsInterface } from '@/Common/Components/CCO006ImagePicker/ImagePickerPropsInterface';
import { CHK005StorageUtils } from '@/Common/Hooks/CHK005StorageUtils';
import i18n from '@/Common/Hooks/i18n-js';
import { ThumbnailStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { TCT011MThumbnailOne } from '@/Thumbnail/Contexts/TCT011MThumbnailOne/ThumbnailOne';
import { TCT023DecorationsMap } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';
import { storage } from '@/Thumbnail/Endpoint/firebaseStorage';

export const TPA001ThumbnailEditorController = ({
	navigation,
	route,
}: ThumbnailStackScreenProps<'TPA001ThumbnailEditor'>) => {
	// パラメータ取得
	const { fromThumbnailID } = route.params;

	// グローバルコンテキスト取得
	const { thumbnailItemMapper, setThumbnailItemMapper } = useContext(CCO001ThumbnailEditor);

	// コンテキスト取得
	const { thumbnail, thumbnailCollectionRef, setThumbnailID } = useContext(TCT011MThumbnailOne);
	const { decorationsMap, setDecorationsMap, getCollection, createDecoration, activeDecorationID, isLoading } =
		useContext(TCT023DecorationsMap);

	const viewShotRef = useRef<ViewShot>(null);

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
			// TODO: テンプレート選択に画面遷移
		}
	}, [fromThumbnailID, setThumbnailID]);

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
		const captureURI = await viewShotRef?.current?.capture?.();
		const downloadURL = captureURI && (await CHK005StorageUtils.uploadImageAsync(storage, captureURI));
		setThumbnailItemMapper((value) => ({
			...value,
			textMap: {},
		}));
		const dummyCaptureURI = await viewShotRef?.current?.capture?.();
		const dummyDownloadURL = dummyCaptureURI && (await CHK005StorageUtils.uploadImageAsync(storage, dummyCaptureURI));
		if (dummyDownloadURL) {
			const thumbnailID = await createThumbnail(dummyDownloadURL);
			if (downloadURL) {
				thumbnailItemMapper.onBack?.(thumbnailID, thumbnailItemMapper, downloadURL);
			}
		}
		navigation.goBack();
	}, [createThumbnail, hideBeforeLeaveDialog, navigation, setThumbnailItemMapper, thumbnailItemMapper]);
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

	const deleteDecoration = useCallback(
		(decorationID: string) => {
			const decoration = decorationsMap[decorationID];
			setDecorationsMap((decolationsMap) => {
				delete decorationsMap[decorationID];
				return decolationsMap;
			});
			if (decoration.decorationType === 'Text') {
				setThumbnailItemMapper((value) => {
					if (!decoration.key) {
						return value;
					}
					delete value.textMap[decoration.key];
					return value;
				});
			}
			if (decoration.decorationType === 'Image' || decoration.decorationType === 'Video') {
				setThumbnailItemMapper((value) => {
					if (!decoration.key) {
						return value;
					}
					delete value.storeUrlMap[decoration.key];
					return value;
				});
			}
		},
		[decorationsMap, setDecorationsMap, setThumbnailItemMapper],
	);

	const [textEditDialog, setTextEditDialog] = useState<{
		visible: boolean;
		key: string | undefined;
		text: string;
	}>({ visible: false, key: undefined, text: '' });
	const hideTextEditDialog = useCallback(() => setTextEditDialog({ visible: false, key: undefined, text: '' }), []);
	const onSaveTextEditing = useCallback(() => {
		if (!textEditDialog.key) {
			return;
		}

		if (textEditDialog.text) {
			const textMapKey = textEditDialog.key;
			setThumbnailItemMapper((value) => ({
				...value,
				textMap: {
					...value.textMap,
					[textMapKey]: textEditDialog.text,
				},
			}));
		} else {
			const targetID = Object.keys(decorationsMap).find((id) => decorationsMap[id].key === textEditDialog.key);
			if (targetID) {
				deleteDecoration(targetID);
			}
		}
		hideTextEditDialog();
	}, [
		decorationsMap,
		deleteDecoration,
		hideTextEditDialog,
		setThumbnailItemMapper,
		textEditDialog.key,
		textEditDialog.text,
	]);
	const onTextChange = useCallback((text: string) => {
		setTextEditDialog((value) => ({
			...value,
			text,
		}));
	}, []);
	const onEditTextClicked = useCallback(() => {
		if (!decorationsMap[activeDecorationID].key) {
			return;
		}
		setTextEditDialog({
			visible: true,
			key: decorationsMap[activeDecorationID].key,
			text: thumbnailItemMapper.textMap[decorationsMap[activeDecorationID].key!] || '',
		});
	}, [activeDecorationID, decorationsMap, thumbnailItemMapper.textMap]);

	const onPickImage: ImagePickerPropsInterface['onPickImage'] = useCallback(
		(imageUrl, key) => {
			setThumbnailItemMapper((v) => {
				if (!key) {
					key = uuid.v4() as string;
				}
				v.storeUrlMap[key] = imageUrl;
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

	const footerMenuList = useMemo(
		() => [
			{
				key: 'EditText',
				title: i18n.t('EditText'),
				icon: 'format-text',
				onPress: onEditTextClicked,
			},
			{ key: 'Order', title: i18n.t('Order'), icon: 'sort', onPress: () => {} },
			{ key: 'Duplication', title: i18n.t('Duplication'), icon: 'content-copy', onPress: duplicationDecoration },
			{ key: 'Replace', title: i18n.t('Replace'), icon: 'file-replace-outline', onPress: () => {} },
			{ key: 'Delete', title: i18n.t('Delete'), icon: 'delete', onPress: () => deleteDecoration(activeDecorationID) },
		],
		[activeDecorationID, deleteDecoration, duplicationDecoration, onEditTextClicked],
	);

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
	const onTextPlusClicked = useCallback(() => {
		const key = uuid.v4() as string;
		setThumbnailItemMapper((value) => ({
			...value,
			textMap: {
				...value.textMap,
				[key]: i18n.t('テキスト入力'),
			},
		}));
		createDecoration({ ...initialDecoration, decorationType: 'Text', key });
	}, [createDecoration, initialDecoration, setThumbnailItemMapper]);
	const onFigurePlusClicked = useCallback(
		() => createDecoration({ ...initialDecoration, decorationType: 'Figure' }),
		[createDecoration, initialDecoration],
	);

	return {
		viewShotRef,
		beforeLeaveDialog,
		hideBeforeLeaveDialog,
		onLeaveScreen,
		onSaveClicked,
		onDiscardClicked,
		textEditDialog,
		hideTextEditDialog,
		onSaveTextEditing,
		onTextChange,
		footerMenuList,
		selectedFooterMenu,
		footerMenuOnPress,
		bringToFront,
		bringForward,
		sendBackward,
		sendToBack,
		deleteDecoration,
		onTextPlusClicked,
		pickImage,
		onFigurePlusClicked,
	};
};
