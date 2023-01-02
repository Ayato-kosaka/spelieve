import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, View } from 'react-native';
import { Headline, Paragraph, Subheading, Text, Button } from 'react-native-paper';

import { RecentItinerariesInterface, getRecentItineraries } from './HelloSpelieveRecentItineraryHook';

import { BottomTabParamList } from '@/App';
import i18n from '@/Common/Hooks/i18n-js';
import { ENV } from '@/ENV';
import { materialColors, paperTheme } from '@/ThemeProvider';

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
			<View style={{ marginHorizontal: 16, marginVertical: 32 }}>
				<Headline>{i18n.t('headline 1')}</Headline>
				<Paragraph>{i18n.t('pragraph')}</Paragraph>
				<Button
					mode="contained"
					labelStyle={{ color: 'white' }}
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
				<View style={{ marginVertical: 16 }}>
					<Headline style={{ textAlign: 'center' }}>{i18n.t('最近作成した旅行プラン')}</Headline>
					{recentItineraries?.map((recentItinerary) => (
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
								borderColor: materialColors.grey[700],
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
			</View>
		</>
	);
};
