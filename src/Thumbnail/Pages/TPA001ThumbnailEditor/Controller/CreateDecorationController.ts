import { Action } from 'expo-image-manipulator';
import { ImagePickerOptions } from 'expo-image-picker';
import { useCallback, useContext, useMemo } from 'react';
import uuid from 'react-native-uuid';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { CCO006ImagePickerController } from '@/Common/Components/CCO006ImagePicker/ImagePickerController';
import { ImagePickerPropsInterface } from '@/Common/Components/CCO006ImagePicker/ImagePickerPropsInterface';
import i18n from '@/Common/Hooks/i18n-js';
import { TCT023DecorationsMap } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';
import { DecorationsMapInterface } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMapInterface';
import { storage } from '@/Thumbnail/Endpoint/firebaseStorage';

export const TPA001CreateDecorationController = ({
	imagePickerOptions,
	imageManipulatorActions,
}: {
	imagePickerOptions: ImagePickerOptions;
	imageManipulatorActions: Action[];
}) => {
	// グローバルコンテキスト取得
	const { setThumbnailItemMapper } = useContext(CCO001ThumbnailEditor);

	const { createDecoration } = useContext(TCT023DecorationsMap);

	const initialDecoration: Pick<
		DecorationsMapInterface,
		'transform' | 'maskTransform' | 'color' | 'borderColor' | 'aspectRatio'
	> = useMemo(
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
			color: '#000',
			borderColor: '#0000',
			aspectRatio: 1,
		}),
		[],
	); // TODO: 要修正 translateX, translateY は 中央に

	const onPickImage: ImagePickerPropsInterface['onPickImage'] = useCallback(
		(imageUrl) => {
			const key = uuid.v4() as string;
			setThumbnailItemMapper((v) => ({
				...v,
				storeUrlMap: {
					...v.storeUrlMap,
					[key]: imageUrl,
				},
			}));
			createDecoration({ ...initialDecoration, decorationType: 'Image', key });
		},
		[createDecoration, initialDecoration, setThumbnailItemMapper],
	);

	const { pickImage } = CCO006ImagePickerController({
		onPickImage,
		storage,
		imagePickerOptions,
		imageManipulatorActions,
	});
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
		onTextPlusClicked,
		pickImage,
		onFigurePlusClicked,
	};
};
