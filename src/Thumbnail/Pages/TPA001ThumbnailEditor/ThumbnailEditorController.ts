import { MediaTypeOptions } from 'expo-image-picker';
import { addDoc, doc, setDoc } from 'firebase/firestore';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { GestureResponderEvent, PressableProps } from 'react-native';
import uuid from 'react-native-uuid';
import ViewShot from 'react-native-view-shot';

import { Decorations } from 'spelieve-common/lib/Models/Thumbnail/TDB02/Decorations';

import { MaskDecorationPropsInterface } from './MaskDecoration/MaskDecorationInterface';
import { TextEditDialogPropsInterface } from './TextEditDialog/TextEditDialog';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { CCO006ImagePickerController } from '@/Common/Components/CCO006ImagePicker/ImagePickerController';
import { ImagePickerPropsInterface } from '@/Common/Components/CCO006ImagePicker/ImagePickerPropsInterface';
import { CHK005StorageUtils } from '@/Common/Hooks/CHK005StorageUtils';
import i18n from '@/Common/Hooks/i18n-js';
import { ThumbnailStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { GestureProviderPropsInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';
import { TCT011MThumbnailOne } from '@/Thumbnail/Contexts/TCT011MThumbnailOne/ThumbnailOne';
import { TCT023DecorationsMap } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';
import { DecorationsMapInterface } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMapInterface';
import { storage } from '@/Thumbnail/Endpoint/firebaseStorage';
import { ThumnailRule } from '@/Thumbnail/Hooks/ThumbnailRule';

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
	const {
		decorationsMap,
		setDecorationsMap,
		getCollection,
		createDecoration,
		activeDecorationID,
		setActiveDecorationID,
	} = useContext(TCT023DecorationsMap);

	const { decorationTypeFeature } = ThumnailRule;

	const viewShotRef = useRef<ViewShot>(null);
	const [onLoadResolveMap, setOnLoadResolveMap] = useState<{ [key: string]: (value: void) => void }>({});

	const activeDecoration: DecorationsMapInterface | undefined = useMemo(
		() => decorationsMap[activeDecorationID],
		[activeDecorationID, decorationsMap],
	);

	const initialDecoration: Pick<DecorationsMapInterface, 'transform' | 'maskTransform'> = useMemo(
		() => ({
			transform: {
				translateX: 200,
				translateY: 200,
				rotateZ: 0,
				scale: 1,
			},
			maskTransform: {
				translateX: 0,
				translateY: 0,
				rotateZ: 0,
				scale: 1,
			},
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

	const deleteDecoration = useCallback(
		(decorationID: string) => {
			const decoration = decorationsMap[decorationID];
			if (!decoration) {
				return;
			}
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

	const [textEditDialog, setTextEditDialog] = useState<TextEditDialogPropsInterface['textEditDialog']>({
		visible: false,
		key: undefined,
	});
	const text = useMemo(
		() => (activeDecoration && activeDecoration.key && thumbnailItemMapper.textMap[activeDecoration.key]) || '',
		[activeDecoration, thumbnailItemMapper.textMap],
	);
	const hideTextEditDialog = useCallback(() => setTextEditDialog({ visible: false, key: undefined }), []);
	const onSaveTextEditing = useCallback(
		(t: string) => () => {
			if (!textEditDialog.key) {
				return;
			}

			if (t) {
				const textMapKey = textEditDialog.key;
				setThumbnailItemMapper((value) => ({
					...value,
					textMap: {
						...value.textMap,
						[textMapKey]: t,
					},
				}));
			} else {
				const targetID = Object.keys(decorationsMap).find((id) => decorationsMap[id]!.key === textEditDialog.key);
				if (targetID) {
					deleteDecoration(targetID);
				}
			}
			hideTextEditDialog();
		},
		[decorationsMap, deleteDecoration, hideTextEditDialog, setThumbnailItemMapper, textEditDialog.key],
	);
	const onEditTextClicked = useCallback(() => {
		if (!activeDecoration || !activeDecoration.key) {
			return;
		}
		setTextEditDialog({
			visible: true,
			key: activeDecoration.key,
		});
	}, [activeDecoration]);

	const [maskDialog, setMaskDialog] = useState<{
		visible: boolean;
		decorationID: string;
		maskUri: Decorations['maskUri'];
		maskTransform: Decorations['maskTransform'];
	}>({
		visible: false,
		decorationID: '',
		maskUri: undefined,
		maskTransform: { translateX: 0, translateY: 0, scale: 1, rotateZ: 0 },
	});
	const onSelectMask = useCallback((maskUri: string) => {
		setMaskDialog((v) => ({ ...v, maskUri }));
	}, []);
	const maskItemStyle: MaskDecorationPropsInterface['maskItemStyle'] = useMemo(
		() =>
			activeDecoration
				? { ...decorationTypeFeature(activeDecoration).designItemStyle, width: '100%' }
				: { width: 0, aspectRatio: 0 },
		[activeDecoration, decorationTypeFeature],
	);
	const onMaskClicked = useCallback(() => {
		if (activeDecoration)
			setMaskDialog({
				visible: true,
				decorationID: activeDecorationID,
				// TODO: あとで変更する
				maskUri: activeDecoration.maskUri ?? 'https://cdn-icons-png.flaticon.com/512/2107/2107776.png',
				maskTransform: activeDecoration.maskTransform,
			});
	}, [activeDecoration, activeDecorationID]);
	const hideMaskDialog = useCallback(() => {
		setMaskDialog({
			visible: false,
			decorationID: '',
			maskUri: undefined,
			maskTransform: { translateX: 0, translateY: 0, scale: 1, rotateZ: 0 },
		});
	}, []);
	const onEndMaskGesture: GestureProviderPropsInterface['onEndGesture'] = useCallback((transorm) => {
		setMaskDialog((v) => ({ ...v, maskTransform: { ...v.maskTransform, ...transorm } }));
	}, []);
	const onSaveMaskDialog = useCallback(() => {
		setDecorationsMap((v) => ({
			...v,
			[maskDialog.decorationID]: v[maskDialog.decorationID]
				? {
						...v[maskDialog.decorationID]!,
						maskUri: maskDialog.maskUri,
						maskTransform: maskDialog.maskTransform,
				  }
				: undefined,
		}));
		hideMaskDialog();
	}, [hideMaskDialog, maskDialog.decorationID, maskDialog.maskTransform, maskDialog.maskUri, setDecorationsMap]);

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
		if (!activeDecoration) {
			return;
		}
		createDecoration(activeDecoration);
	}, [activeDecoration, createDecoration]);

	const bringToFront = useCallback(() => {
		if (!activeDecoration) {
			return;
		}
		setDecorationsMap({
			...decorationsMap,
			[activeDecorationID]: {
				...activeDecoration,
				order:
					Object.keys(decorationsMap).reduce(
						(prev, key) => Math.max(prev, decorationsMap[key]!.order),
						Number.MIN_SAFE_INTEGER,
					) + 1,
			},
		});
	}, [activeDecoration, activeDecorationID, decorationsMap, setDecorationsMap]);

	const bringForward = useCallback(() => {
		if (!activeDecoration) {
			return;
		}
		const targetID =
			Object.keys(decorationsMap)
				.filter((key) => decorationsMap[key]!.order > activeDecoration.order)
				.sort((keyA, keyB) => decorationsMap[keyA]!.order - decorationsMap[keyB]!.order)[0] || activeDecorationID;
		setDecorationsMap({
			...decorationsMap,
			[activeDecorationID]: {
				...activeDecoration,
				order: decorationsMap[targetID]!.order,
			},
			[targetID]: {
				...decorationsMap[targetID]!,
				order: activeDecoration.order,
			},
		});
	}, [activeDecoration, activeDecorationID, decorationsMap, setDecorationsMap]);

	const sendBackward = useCallback(() => {
		if (!activeDecoration) {
			return;
		}
		const targetID =
			Object.keys(decorationsMap)
				.filter((key) => decorationsMap[key]!.order < activeDecoration.order)
				.sort((keyA, keyB) => decorationsMap[keyB]!.order - decorationsMap[keyA]!.order)[0] || activeDecorationID;
		setDecorationsMap({
			...decorationsMap,
			[activeDecorationID]: {
				...activeDecoration,
				order: decorationsMap[targetID]!.order,
			},
			[targetID]: {
				...decorationsMap[targetID]!,
				order: activeDecoration.order,
			},
		});
	}, [activeDecoration, activeDecorationID, decorationsMap, setDecorationsMap]);

	const sendToBack = useCallback(() => {
		if (!activeDecoration) {
			return;
		}
		setDecorationsMap({
			...decorationsMap,
			[activeDecorationID]: {
				...activeDecoration,
				order:
					Object.keys(decorationsMap).reduce(
						(prev, key) => Math.min(prev, decorationsMap[key]!.order),
						Number.MAX_SAFE_INTEGER,
					) - 1,
			},
		});
	}, [activeDecoration, activeDecorationID, decorationsMap, setDecorationsMap]);

	const footerMenuList = useMemo(
		() => [
			{
				key: 'EditText' as const,
				title: i18n.t('EditText'),
				icon: 'format-text',
				onPress: onEditTextClicked,
			},
			{ key: 'Replace' as const, title: i18n.t('Replace'), icon: 'file-replace-outline', onPress: () => {} },
			{ key: 'Color' as const, title: i18n.t('Color'), icon: 'palette-outline', onPress: () => {} },
			{ key: 'Mask' as const, title: i18n.t('Mask'), icon: 'content-cut', onPress: onMaskClicked },
			{ key: 'Order' as const, title: i18n.t('Order'), icon: 'sort', onPress: () => {} },
			{
				key: 'Duplicate' as const,
				title: i18n.t('Duplication'),
				icon: 'content-copy',
				onPress: duplicationDecoration,
			},
			{
				key: 'Delete' as const,
				title: i18n.t('Delete'),
				icon: 'delete',
				onPress: () => deleteDecoration(activeDecorationID),
			},
		],
		[activeDecorationID, deleteDecoration, duplicationDecoration, onEditTextClicked, onMaskClicked],
	);

	const [selectedFooterMenu, setSelectedFooterMenu] = useState<(typeof footerMenuList)[number]['key'] | ''>('');
	// useEffect(() => {
	// 	if(footerMenuList.find(footerMenu => footerMenu.key === selectedFooterMenu)?.)
	// 	setSelectedFooterMenu('')
	// }, [])
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

	const [colorPickerDialog, setColorPickerDialog] = useState<{
		visible: boolean;
	}>({ visible: false });
	useEffect(() => {
		if (selectedFooterMenu === 'Color') {
			setColorPickerDialog({ visible: true });
		}
	}, [selectedFooterMenu]);
	const hideColorPickerDialog = useCallback(() => {
		setColorPickerDialog({ visible: false });
		setSelectedFooterMenu('');
	}, []);
	const onSaveColorPickerDialog = useCallback(
		(color: string) => () => {
			hideColorPickerDialog();
			if (!activeDecoration) {
				return;
			}
			setDecorationsMap((v) => ({
				...v,
				[activeDecorationID]: {
					...activeDecoration,
					color,
				},
			}));
		},
		[activeDecoration, activeDecorationID, hideColorPickerDialog, setDecorationsMap],
	);

	return {
		activeDecoration,
		viewShotRef,
		onLoadResolveMap,
		beforeLeaveDialog,
		hideBeforeLeaveDialog,
		onLeaveScreen,
		onSaveClicked,
		onDiscardClicked,
		textEditDialog,
		text,
		hideTextEditDialog,
		onSaveTextEditing,
		maskDialog,
		onEndMaskGesture,
		onSaveMaskDialog,
		maskItemStyle,
		hideMaskDialog,
		colorPickerDialog,
		hideColorPickerDialog,
		onSaveColorPickerDialog,
		footerMenuList,
		selectedFooterMenu,
		footerMenuOnPress,
		bringToFront,
		bringForward,
		sendBackward,
		sendToBack,
		onTextPlusClicked,
		pickImage,
		onFigurePlusClicked,
	};
};
