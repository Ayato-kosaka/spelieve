import React, { useContext, useEffect, useState } from 'react';
import { Linking, SafeAreaView, View, Image, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, Button, Headline } from 'react-native-paper';

import { RecentItinerariesInterface, getRecentItineraries } from './HelloSpelieveRecentItineraryHook';
import { styles } from './HelloSpelieveStyle';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { consoleError, getWindowWidth } from '@/Common/Hooks/CHK001Utils';
import i18n from '@/Common/Hooks/i18n-js';
import { ItineraryStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { ENV } from '@/ENV';
import { customColors } from '@/ThemeProvider';

export const CPA001HelloSpelieve = ({ route, navigation }: ItineraryStackScreenProps<'HelloSpelieve'>) => {
	const [recentItineraries, setRecentItineraries] = useState<RecentItinerariesInterface | undefined>(undefined);
	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			(async () => {
				setRecentItineraries(
					(await getRecentItineraries()).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
				);
			})().catch((e) => consoleError('CPA001HelloSpelieve', 'setRecentItineraries', e));
		});
		return unsubscribe;
	}, [navigation]);

	const { setThumbnailItemMapper } = useContext(CCO001ThumbnailEditor);

	const windowWidth = getWindowWidth();

	return (
		// TODO: https://github.com/Ayato-kosaka/spelieve/issues/156 LP作成計画検討
		<>
			<SafeAreaView />
			<ScrollView>
				<View style={styles.header}>
					<Text style={styles.headerTitleText}>Spelieve</Text>
				</View>
				<Button
						testID="createItineraryButton"
						mode="contained"
						labelStyle={{ color: 'white', fontSize: 16 }}
						style={{
							paddingVertical: 8,
							width: '90%',
							textAlign: 'right',
							backGroundColor: 'black',
							marginHorizontal: 'auto',
							marginVertical: 30,
						}}
						onPress={() =>
							navigation.navigate('ItineraryTopTabNavigator', {
								screen: 'ItineraryEdit',
								params: { itineraryID: undefined },
							})
						}>
						{i18n.t('新しく始める')}
					</Button>
				{recentItineraries && recentItineraries.length > 0 && (
					<View style={styles.recentlyItineraryArea}>
						<Headline style={styles.headLineText}>{i18n.t('最近作成した旅行しおり')}</Headline>
						<ScrollView
							style={styles.recentlyItineraryScroll}
							contentContainerStyle={styles.recentlyItineraryScrollContainer}>
							{recentItineraries.map((recentItinerary) => (
								<Pressable
									key={recentItinerary.itineraryID}
									onPress={() => {
										navigation.navigate('ItineraryTopTabNavigator', {
											screen: 'ItineraryEdit',
											params: {
												itineraryID: recentItinerary.itineraryID,
											},
										});
									}}
									style={styles.recentlyItineraryPressable}>
									<View style={styles.recentlyItineraryView}>
										{recentItinerary.imageUrl ? (
											<Image source={{ uri: recentItinerary.imageUrl }} style={styles.recentlyItineraryImage} />
										) : (
											<View style={styles.recentlyItineraryNoImageArea}>
												<View style={styles.recentlyItineraryNoImageContent}>
													<Text style={styles.recentlyItineraryNoImageText}>{i18n.t('No Thumbnail')}</Text>
												</View>
											</View>
										)}
									</View>
								</Pressable>
							))}
						</ScrollView>
					</View>
				)}
				<View style={styles.featuresArea}>
					<Headline style={styles.headLineText}>{i18n.t('Spelieve の特徴')}</Headline>
					<Image
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require
						source={require('@assets/LP_feature1.jpeg')}
						style={styles.featureImage}
						resizeMode="cover"
					/>
					<Text style={styles.featureTitle}>{i18n.t('自動計算機能')}</Text>
					<View style={{ alignItems: 'center' }}>
						<Text style={styles.simpleExplanation}>
							{i18n.t('1つのプラン変更しても自動計算で全体が調整 旅の途中にプランの変更があっても安心')}
						</Text>
					</View>
					<Image
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require
						source={require('@assets/LP_feature2.jpeg')}
						style={styles.featureImage}
						resizeMode="cover"
					/>
					<Text style={styles.featureTitle}>{i18n.t('サムネイル機能')}</Text>
					<View style={{ alignItems: 'center' }}>
						<Text style={styles.simpleExplanation}>
							{i18n.t('独自の旅しおりをカスタマイズ 写真でプランを鮮やかに表現し 個性的な冒険を創造しましょう')}
						</Text>
					</View>
					{/* <Text>独自の旅しおりをカスタマイズ{'\n'}写真でプランを鮮やかに表現し、個性的な冒険を創造しましょう。</Text> */}
					<Image
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require
						source={require('@assets/LP_feature3.jpeg')}
						style={styles.featureImage}
						resizeMode="cover"
					/>
					<Text style={styles.featureTitle}>{i18n.t('共同作成機能')}</Text>
					<View style={{ alignItems: 'center' }}>
						<Text style={styles.simpleExplanation}>
							{i18n.t(
								'予定調整やアイデア共有が簡単！ 共有された側もインストール不要！ 思い出に残る旅行を一緒に作り上げよう',
							)}
						</Text>
					</View>
				</View>
				<View>
					<Button
						testID="createItineraryButton"
						mode="contained"
						labelStyle={{ color: 'white', fontSize: 16 }}
						style={{
							paddingVertical: 8,
							width: '90%',
							textAlign: 'right',
							backGroundColor: 'black',
							marginHorizontal: 'auto',
							marginVertical: 30,
						}}
						onPress={() =>
							navigation.navigate('ItineraryTopTabNavigator', {
								screen: 'ItineraryEdit',
								params: { itineraryID: undefined },
							})
						}>
						{i18n.t('新しく始める')}
					</Button>
					<Button
						mode="contained"
						labelStyle={{ color: 'white', fontSize: 16 }}
						style={{
							paddingVertical: 8,
							width: '90%',
							textAlign: 'right',
							marginHorizontal: 'auto',
							marginVertical: 30,
						}}
						color="#c0c0c0"
						onPress={() => navigation.navigate('HelloSpelieve', {})} // TODO: https://github.com/Ayato-kosaka/spelieve/issues/894 参照先作成次第navigation追加
					>
						{i18n.t('サンプルしおりを参照')}
					</Button>
				</View>
				<View style={{ alignItems: 'center' }}>
					<Headline style={styles.headLineText}>{i18n.t('Spelieve の使い方')}</Headline>
					<View style={styles.howToUseBox}>
						<View style={styles.howToUseNumber}>
							<Text style={styles.howToUseNumberText}>1</Text>
						</View>
						<Text style={styles.howToUseText}>{i18n.t('しおりを作成')}</Text>
						<Image
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require
							source={require('@assets/HowToUse1.png')}
							style={styles.howToUseImage}
							resizeMode="cover"
						/>
						<Text style={styles.simpleExplanation}>{i18n.t('新しく始めるボタンから しおりを新規作成できます')}</Text>
					</View>
					<View style={styles.howToUseBox}>
						<View style={styles.howToUseNumber}>
							<Text style={styles.howToUseNumberText}>2</Text>
						</View>
						<Text style={styles.howToUseText}>{i18n.t('訪れる予定の場所を入力')}</Text>
						<Image
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require
							source={require('@assets/HowToUse2.png')}
							style={styles.howToUseImage}
							resizeMode="cover"
						/>
						<Text style={styles.simpleExplanation}>
							{i18n.t('訪れる場所を追加しましょう Add Plan ボタンを押すと 新しく場所を追加できます')}
						</Text>
					</View>
					<View style={styles.howToUseBox}>
						<View style={styles.howToUseNumber}>
							<Text style={styles.howToUseNumberText}>3</Text>
						</View>
						<Text style={styles.howToUseText}>{i18n.t('URLをコピーし、友達にシェア')}</Text>
						<Image
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require
							source={require('@assets/HowToUse3.png')}
							style={styles.howToUseImage}
							resizeMode="cover"
						/>
						<Text style={styles.simpleExplanation}>
							{i18n.t('画面下部でしおりのURLをコピー可能 一緒に行く友人や家族に共有しよう!')}
						</Text>
					</View>
					<View style={styles.howToUseBox}>
						<View style={styles.howToUseNumber}>
							<Text style={styles.howToUseNumberText}>4</Text>
						</View>
						<Text style={styles.howToUseText}>{i18n.t('旅行を楽しむ！')}</Text>
						<Image
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require
							source={require('@assets/HowToUse4.png')}
							style={{
								width: 200,
								height: 200,
								marginVertical: 20,
							}}
							resizeMode="cover"
						/>
					</View>
					<Button
						testID="createItineraryButton"
						mode="contained"
						labelStyle={{ color: 'white', fontSize: 16 }}
						style={{
							paddingVertical: 8,
							width: '90%',
							textAlign: 'right',
							backGroundColor: 'black',
							marginHorizontal: 'auto',
							marginVertical: 30,
						}}
						onPress={() =>
							navigation.navigate('ItineraryTopTabNavigator', {
								screen: 'ItineraryEdit',
								params: { itineraryID: undefined },
							})
						}>
						{i18n.t('新しく始める')}
					</Button>
				</View>
				<View style={{ backgroundColor: customColors.midnight, paddingTop: 40 }}>
					<Button
						color="white"
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						onPress={() =>
							Linking.openURL(
								'https://docs.google.com/forms/d/e/1FAIpQLSc0f-CYZAb6kBsWlMZ_5W4c0CMipNSbo-zEivUMa_jrMy4UFA/viewform?usp=sf_link',
							)
						}>
						{i18n.t('お問い合わせ')}
					</Button>
					<Button
						color="white"
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						onPress={() =>
							Linking.openURL(
								'https://docs.google.com/forms/d/e/1FAIpQLSc5tuLbjx5CZX2pBr3wz9rcpdX710y6Ov2wVu2LObhIwFD5vQ/viewform?usp=sf_link',
							)
						}>
						{i18n.t('フィードバック')}
					</Button>
					<Text style={{ color: 'white', textAlign: 'center', paddingVertical: 32 }}>
						{i18n.t('Copyright © Spelieve ') + new Date().getFullYear().toString()}
					</Text>
				</View>
				{ENV.LOGGER && (
					<Button
						mode="contained"
						onPress={() => {
							setThumbnailItemMapper({
								aspectRatio: 1,
								textMap: { xxx: 'サンプル横浜行くぞい！' },
								storeUrlMap: {
									'b87e0c4d-bb1f-48a9-a304-80ce4728f2a7':
										'https://firebasestorage.googleapis.com/v0/b/spelieve-dev.appspot.com/o/12373bcd-013b-43d3-bbcf-f95c3d991edc?alt=media&token=91171ed7-7a92-439b-9c4b-a675cabe49bc',
								},
								onBack(thumbnailID, thumbnailItemMapper, uri) {
									// eslint-disable-next-line no-console
									console.log('onBack', { thumbnailID, thumbnailItemMapper, uri });
								},
							});
							navigation.navigate('ThumbnailPageNavigator', {
								screen: 'TPA001ThumbnailEditor',
								params: {
									fromThumbnailID: 'HVClefrb102gUdcTp2Cu',
								},
							});
						}}>
						{i18n.t('開発者用')}
					</Button>
				)}
			</ScrollView>
		</>
	);
};
