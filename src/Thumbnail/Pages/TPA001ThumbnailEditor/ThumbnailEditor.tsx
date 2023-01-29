import { MediaTypeOptions } from 'expo-image-picker';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { GestureResponderEvent, Pressable, PressableProps, SafeAreaView, ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';

import { CCO006ImagePickerController } from '@/Common/Components/CCO006ImagePicker/ImagePickerController';
import { ImagePickerPropsInterface } from '@/Common/Components/CCO006ImagePicker/ImagePickerPropsInterface';
import i18n from '@/Common/Hooks/i18n-js';
import { storage } from '@/Itinerary/Endpoint/firebaseStorage';
import { TMC01101ThumbnailBackground } from '@/Thumbnail/Contexts/TCT011MThumbnailOne/ModelComponents/TMC01101ThumbnailBackground/ThumbnailBackground';
import {
	TCT023DecorationsMap,
	TCT023DecorationsMapProvider,
} from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';

const MThumbnail = {
	baseItemType: 'Shape',
};

export const TPA001ThumbnailEditor = () =>
	// { navigation, route }: NativeStackScreenProps<BottomTabParamList, 'PPA001Places'>
	{
		const { decorationsMap, setDecorationsMap, createDecoration, activeDecorationID } =
			useContext(TCT023DecorationsMap);
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
			(imageUrl) => {
				createDecoration({ ...initialDecoration, decorationType: 'Image', imageUrl });
			},
			[createDecoration, initialDecoration],
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
			{ key: 'Order', title: i18n.t('Order'), icon: '', onPress: () => {} },
			{ key: 'Duplication', title: i18n.t('Duplication'), icon: '', onPress: duplicationDecoration },
			{ key: 'Replace', title: i18n.t('Replace'), icon: '', onPress: () => {} },
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

		return (
			<>
				<SafeAreaView />
				<View style={{ height: '100%', justifyContent: 'space-between' }}>
					<View>
						<Pressable onPress={() => createDecoration({ ...initialDecoration, decorationType: 'Text' })}>
							<Text>New Text</Text>
						</Pressable>
						{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
						<Pressable onPress={pickImage}>
							<Text>New Image</Text>
						</Pressable>
						<Pressable onPress={() => createDecoration({ ...initialDecoration, decorationType: 'Figure' })}>
							<Text>New Figure</Text>
						</Pressable>
					</View>
					<TMC01101ThumbnailBackground aspectRatio={4 / 3} />
					<View>
						<ScrollView horizontal>
							{footerMenuList.map((footerMenu, index) => (
								<Pressable key={footerMenu.key} onPress={footerMenuOnPress(footerMenu.onPress, footerMenu.key)}>
									<Text>{footerMenu.title}</Text>
								</Pressable>
							))}
						</ScrollView>
						{selectedFooterMenu === 'Order' && (
							<View>
								<Pressable onPress={bringToFront}>
									<Text>{i18n.t('Bring to Front')}</Text>
								</Pressable>
								<Pressable onPress={bringForward}>
									<Text>{i18n.t('Bring Forward')}</Text>
								</Pressable>
								<Pressable onPress={sendBackward}>
									<Text>{i18n.t('Send Backward')}</Text>
								</Pressable>
								<Pressable onPress={sendToBack}>
									<Text>{i18n.t('Send to Back')}</Text>
								</Pressable>
							</View>
						)}
					</View>
				</View>
			</>
		);
	};

export const ThumbnailEditorEntory = () => (
	<TCT023DecorationsMapProvider>
		<TPA001ThumbnailEditor />
	</TCT023DecorationsMapProvider>
);
