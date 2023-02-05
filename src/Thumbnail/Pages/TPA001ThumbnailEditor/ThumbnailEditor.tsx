import { MediaTypeOptions } from 'expo-image-picker';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { GestureResponderEvent, Pressable, PressableProps, SafeAreaView, ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import uuid from 'react-native-uuid';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { styles } from './ThumbnailEditorStyle';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { CCO006ImagePickerController } from '@/Common/Components/CCO006ImagePicker/ImagePickerController';
import { ImagePickerPropsInterface } from '@/Common/Components/CCO006ImagePicker/ImagePickerPropsInterface';
import i18n from '@/Common/Hooks/i18n-js';
import { ThumbnailStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { storage } from '@/Itinerary/Endpoint/firebaseStorage';
import { TMC01101ThumbnailBackground } from '@/Thumbnail/Contexts/TCT011MThumbnailOne/ModelComponents/TMC01101ThumbnailBackground/ThumbnailBackground';
import { TCT023DecorationsMap } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';

const MThumbnail = {
	backgroundItemType: 'Shape',
};

export const TPA001ThumbnailEditor = ({ navigation, route }: ThumbnailStackScreenProps<'TPA001ThumbnailEditor'>) => {
	const { thumbnailItemMapper, setThumbnailItemMapper } = useContext(CCO001ThumbnailEditor);
	const { textList, storeUrlMap } = thumbnailItemMapper;
	console.log(textList && textList[0], storeUrlMap);

	const { decorationsMap, setDecorationsMap, createDecoration, activeDecorationID } = useContext(TCT023DecorationsMap);
	const initialDecoration = useMemo(
		() => ({
			translateX: 200,
			translateY: 200,
			rotateZ: 0,
			scale: 1,
		}),
		[],
	); // TODO: 要修正 translateX, translateY は 中央に

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
	const headerRight = useCallback(
		() => (
			<View style={{ flexDirection: 'row' }}>
				{headerRightItems
					.filter((item) => item.show())
					?.map((item) => (
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						<MaterialCommunityIcons key={item.key} name={item.icon} size={30} onPress={item.onPress} />
					))}
			</View>
		),
		[headerRightItems],
	);

	useEffect(() => {
		navigation.setOptions({
			headerRight,
		});
	}, [headerRight, navigation]);

	return (
		<>
			<SafeAreaView />
			<View style={{ height: '100%', justifyContent: 'space-between' }}>
				<TMC01101ThumbnailBackground aspectRatio={4 / 3} />
				<View>
					<ScrollView horizontal>
						{footerMenuList.map((footerMenu, index) => (
							<Pressable
								key={footerMenu.key}
								onPress={footerMenuOnPress(footerMenu.onPress, footerMenu.key)}
								style={{ width: 80 }}>
								<MaterialCommunityIcons name={footerMenu.icon} size={30} style={{ textAlign: 'center' }} />
								<Text style={{ textAlign: 'center' }}>{footerMenu.title}</Text>
							</Pressable>
						))}
					</ScrollView>
					{selectedFooterMenu === 'Order' && (
						<View>
							<Pressable onPress={bringToFront} style={styles.orderPressable}>
								<MaterialCommunityIcons name="arrange-bring-to-front" size={20} />
								<Text>{i18n.t('Bring to Front')}</Text>
							</Pressable>
							<Pressable onPress={bringForward} style={styles.orderPressable}>
								<MaterialCommunityIcons name="arrange-bring-forward" size={20} />
								<Text>{i18n.t('Bring Forward')}</Text>
							</Pressable>
							<Pressable onPress={sendBackward} style={styles.orderPressable}>
								<MaterialCommunityIcons name="arrange-send-backward" size={20} />
								<Text>{i18n.t('Send Backward')}</Text>
							</Pressable>
							<Pressable onPress={sendToBack} style={styles.orderPressable}>
								<MaterialCommunityIcons name="arrange-send-to-back" size={20} />
								<Text>{i18n.t('Send to Back')}</Text>
							</Pressable>
						</View>
					)}
				</View>
			</View>
		</>
	);
};
