import React, { useCallback, useContext, useEffect } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewShot from 'react-native-view-shot';

import { TPA001ThumbnailEditorController } from './ThumbnailEditorController';
import { styles } from './ThumbnailEditorStyle';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import i18n from '@/Common/Hooks/i18n-js';
import { ThumbnailStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { TMC01101ThumbnailBackground } from '@/Thumbnail/Contexts/TCT011MThumbnailOne/ModelComponents/TMC01101ThumbnailBackground/ThumbnailBackground';
import { TCT023DecorationsMap } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';

export const TPA001ThumbnailEditor = ({ navigation, route }: ThumbnailStackScreenProps<'TPA001ThumbnailEditor'>) => {
	// グローバルコンテキスト取得
	const { thumbnailItemMapper, setThumbnailItemMapper } = useContext(CCO001ThumbnailEditor);
	const { textList } = thumbnailItemMapper;

	// コンテキスト取得
	const { isLoading } = useContext(TCT023DecorationsMap);

	const {
		viewShotRef,
		dialog,
		hideDialog,
		onLeaveScreen,
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
	} = TPA001ThumbnailEditorController({
		navigation,
		route,
	});

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
	const headerLeft = useCallback(
		() => (
			<View style={{ flexDirection: 'row' }}>
				<MaterialCommunityIcons name="close" size={30} onPress={onLeaveScreen} />
			</View>
		),
		[onLeaveScreen],
	);
	useEffect(() => {
		navigation.setOptions({
			headerRight,
			headerLeft,
		});
	}, [headerLeft, headerRight, navigation]);

	if (isLoading) {
		return <ActivityIndicator animating />;
	}

	return (
		<>
			<SafeAreaView />
			<Portal>
				<Dialog visible={dialog.visible} onDismiss={hideDialog}>
					<Dialog.Title>{i18n.t('Discard Thumbnail?')}</Dialog.Title>
					<Dialog.Content>
						<Text>{i18n.t('変更を保存せずに戻りますか？')}</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={hideDialog} color="black">
							{i18n.t('Cancel')}
						</Button>
						<Button
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onPress={onSaveClicked}
							color="black">
							{i18n.t('Save')}
						</Button>
						<Button onPress={onDiscardClicked} color="red">
							{i18n.t('Discard')}
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
			<View style={{ height: '100%', justifyContent: 'space-between' }}>
				<Button
					onPress={() => {
						navigation.navigate('TPA002ThumbnailTemplate', {});
					}}>
					go to template
				</Button>
				<ViewShot
					// resize する
					ref={viewShotRef}>
					<TMC01101ThumbnailBackground aspectRatio={4 / 3} />
				</ViewShot>
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
