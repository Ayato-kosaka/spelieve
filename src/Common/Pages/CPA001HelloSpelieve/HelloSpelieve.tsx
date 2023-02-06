import { useEffect, useState } from 'react';
import { Linking, Pressable, SafeAreaView, View, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Headline, Subheading, Text, Button, Title } from 'react-native-paper';

import { RecentItinerariesInterface, getRecentItineraries } from './HelloSpelieveRecentItineraryHook';

import i18n from '@/Common/Hooks/i18n-js';
import { ItineraryStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { ENV } from '@/ENV';
import { GooglePlaceLanguageTagFromIETFLanguageTag } from '@/Place/Hooks/PHK001GooglePlaceAPI';
import { customColors, materialColors, paperTheme } from '@/ThemeProvider';
import { AppOpenAd, InterstitialAd, RewardedAd, BannerAd, TestIds, BannerAdSize } from 'react-native-google-mobile-ads';

export const CPA001HelloSpelieve = ({ route, navigation }: ItineraryStackScreenProps<'HelloSpelieve'>) => {
	const [recentItineraries, setRecentItineraries] = useState<RecentItinerariesInterface | undefined>(undefined);
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		(async () => {
			setRecentItineraries(
				(await getRecentItineraries()).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
			);
		})();
	});

	return (
		// TODO: https://github.com/Ayato-kosaka/spelieve/issues/156 LP作成計画検討
		<>
			<SafeAreaView />
			<ScrollView>
				<BannerAd 
					unitId={TestIds.BANNER}
					size={BannerAdSize.FULL_BANNER}
					requestOptions={{
						requestNonPersonalizedAdsOnly: true,
					}}
				/>
				<Image
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require
					source={require('@assets/adaptive-icon.png')}
					style={{ paddingTop: '60%', width: '100%' }}
					resizeMode="contain"
				/>
				<View style={{ marginHorizontal: 16, marginVertical: 32 }}>
					<Headline>{`${i18n.t('あなたの旅行もっと「楽」に')}\n${i18n.t('素晴らしい「思い出」に')}`}</Headline>
					<Button
						mode="contained"
						labelStyle={{ color: 'white', fontSize: 16 }}
						style={{ marginVertical: 32, paddingVertical: 8 }}
						onPress={() =>
							navigation.navigate('ItineraryTopTabNavigator', {
								screen: 'ItineraryEdit',
								params: { itineraryID: undefined },
							})
						}>
						{i18n.t('新しく始める')}
					</Button>
					<Image
						source={
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
							GooglePlaceLanguageTagFromIETFLanguageTag[i18n.locale] === 'ja'
								? // eslint-disable-next-line global-require
								  require('@assets/JP-sol.png')
								: // eslint-disable-next-line global-require
								  require('@assets/EN-sol.png')
						}
						style={{ width: '100%', height: 200 }}
						resizeMode="contain"
					/>
					<View style={{ flex: 1, width: '100%' }}>
						<View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', marginVertical: 10 }}>
							<View
								style={{
									backgroundColor: materialColors.grey[200],
									flex: 0.5,
									alignItems: 'center',
									justifyContent: 'center',
									height: 150,
									marginHorizontal: 12,
									borderRadius: 10,
								}}>
								<Text>{i18n.t('特徴1')}</Text>
								<Title>{i18n.t('しおり簡単作成')}</Title>
							</View>
							<View
								style={{
									backgroundColor: materialColors.grey[200],
									flex: 0.5,
									alignItems: 'center',
									justifyContent: 'center',
									height: 150,
									marginHorizontal: 12,
									borderRadius: 10,
								}}>
								<Text>{i18n.t('特徴2')}</Text>
								<Title>{`${i18n.t('移動時間')}\n${i18n.t('自動計算')}`}</Title>
							</View>
						</View>
						<View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', marginVertical: 10 }}>
							<View
								style={{
									backgroundColor: materialColors.grey[200],
									flex: 0.5,
									alignItems: 'center',
									justifyContent: 'center',
									height: 150,
									marginHorizontal: 12,
									borderRadius: 10,
								}}>
								<Text>{i18n.t('特徴3')}</Text>
								<Title>{i18n.t('マップ検索')}</Title>
							</View>
							<View
								style={{
									backgroundColor: materialColors.grey[200],
									flex: 0.5,
									alignItems: 'center',
									justifyContent: 'center',
									height: 150,
									marginHorizontal: 12,
									borderRadius: 10,
								}}>
								<Text>{i18n.t('特徴4')}</Text>
								<Title>{i18n.t('思い出化')}</Title>
							</View>
						</View>
					</View>
					{recentItineraries && recentItineraries.length > 0 && (
						<View style={{ marginVertical: 64 }}>
							<Headline style={{ textAlign: 'center' }}>{i18n.t('最近作成した旅行プラン')}</Headline>
							<ScrollView style={{ maxHeight: 700 }}>
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
										style={{
											borderWidth: 1,
											borderColor: materialColors.grey[400],
											borderRadius: 4,
											marginVertical: 4,
											paddingHorizontal: 4,
											paddingVertical: 4,
										}}>
										<Subheading style={{ color: paperTheme.colors.primary }}>
											{recentItinerary.title || i18n.t('no title')}
										</Subheading>
										<Text>{recentItinerary.subTitle || i18n.t('no sub title')}</Text>
										<Text style={{ color: materialColors.grey[700] }}>
											{recentItinerary.updatedAt.toLocaleDateString('en-US', {
												year: 'numeric',
												month: '2-digit',
												day: '2-digit',
											})}
										</Text>
									</Pressable>
								))}
							</ScrollView>
						</View>
					)}
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
						onPress={() =>
							navigation.navigate('ItineraryTopTabNavigator', {
								screen: 'ItineraryEdit',
								params: {
									itineraryID: 'uMFhF6OQph2UUuKEsKNa',
								},
							})
						}>
						{i18n.t('開発者用 Itinerary で始める')}
					</Button>
				)}
			</ScrollView>
		</>
	);
};
