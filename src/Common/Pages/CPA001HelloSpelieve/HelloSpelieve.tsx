import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Linking, Pressable, SafeAreaView, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Headline, Subheading, Text, Button } from 'react-native-paper';

import { RecentItinerariesInterface, getRecentItineraries } from './HelloSpelieveRecentItineraryHook';

import { BottomTabParamList } from '@/App';
import i18n from '@/Common/Hooks/i18n-js';
import { ENV } from '@/ENV';
import { customColors, materialColors, paperTheme } from '@/ThemeProvider';

export const CPA001HelloSpelieve = ({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'HelloSpelieve'>) => {
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
				<View style={{ marginHorizontal: 16, marginVertical: 32 }}>
					{/* <Headline>{i18n.t('headline 1')}</Headline>
					<Paragraph>
						{i18n.t(
							'pragraph1\npragraph1\npragraph1\npragraph1\npragraph1\npragraph1\npragraph1\npragraph1\npragraph1',
						)}
					</Paragraph>
					<Paragraph>
						{i18n.t(
							'pragraph2\npragraph2\npragraph2\npragraph2\npragraph2\npragraph2\npragraph2\npragraph2\npragraph2',
						)}
					</Paragraph> */}
					<Button
						mode="contained"
						labelStyle={{ color: 'white', fontSize: 16 }}
						style={{ marginVertical: 32, paddingVertical: 8 }}
						onPress={() =>
							navigation.navigate('Itinerary', {
								screen: 'ItineraryTopTabNavigator',
								params: {
									screen: 'IPA001ItineraryEdit',
									params: { itineraryID: undefined },
								},
							})
						}>
						{i18n.t('新しく始める')}
					</Button>
					{recentItineraries && recentItineraries.length > 0 && (
						<View style={{ marginVertical: 64 }}>
							<Headline style={{ textAlign: 'center' }}>{i18n.t('最近作成した旅行プラン')}</Headline>
							<ScrollView style={{ maxHeight: 700 }}>
								{recentItineraries.map((recentItinerary) => (
									<Pressable
										key={recentItinerary.itineraryID}
										onPress={() => {
											navigation.navigate('Itinerary', {
												screen: 'ItineraryTopTabNavigator',
												params: {
													screen: 'IPA001ItineraryEdit',
													params: {
														itineraryID: recentItinerary.itineraryID,
													},
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
											{recentItinerary.updatedAt.toLocaleString('en-US', {
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
						{i18n.t(`Copyright © Spelieve ${new Date().getFullYear()}`)}
					</Text>
				</View>
				{ENV.LOGGER && (
					<Button
						mode="contained"
						onPress={() =>
							navigation.navigate('Itinerary', {
								screen: 'ItineraryTopTabNavigator',
								params: {
									screen: 'IPA001ItineraryEdit',
									params: {
										itineraryID: 'uMFhF6OQph2UUuKEsKNa',
									},
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
