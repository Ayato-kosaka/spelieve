import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Image, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Card, Headline, Text } from 'react-native-paper';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { getWindowWidth } from '@/Common/Hooks/CHK001Utils';
import i18n from '@/Common/Hooks/i18n-js';
import { ItineraryStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { materialColors, primaryColorNm } from '@/ThemeProvider';

export const CPA001HelloSpelieve = ({ route, navigation }: ItineraryStackScreenProps<'HelloSpelieve'>) => {
	const MTilmelines = useMemo(
		() => [
			{
				title: 'root',
				image: 'https://cdn.inmemoriam.com/images/LifeTimeLine-Slide-Bubble-V01-Vertical-FB-Preview.png',
				parentTimelineTitle: '',
			},
			{
				title: '2020',
				image: 'https://www.photock.jp/photo/big/photo0000-1634.jpg',
				parentTimelineTitle: 'root',
				plans: [
					{
						title: 'plan1',
						placeStartTime: new Date(2022, 9, 1, 10, 0),
						placeEndTime: new Date(2022, 9, 1, 11, 0),
					},
					{
						title: 'plan2',
						placeStartTime: new Date(2022, 9, 1, 11, 0),
						placeEndTime: new Date(2022, 9, 1, 12, 0),
					},
				],
			},
			{
				title: '2021',
				image: 'https://www.photock.jp/photo/big/photo0000-1642.jpg',
				parentTimelineTitle: 'root',
				plans: [
					{
						title: 'plan1',
						placeStartTime: new Date(2022, 9, 1, 10, 0),
						placeEndTime: new Date(2022, 9, 1, 11, 0),
					},
					{
						title: 'plan2',
						placeStartTime: new Date(2022, 9, 1, 11, 0),
						placeEndTime: new Date(2022, 9, 1, 12, 0),
					},
				],
			},
			{
				title: '2022',
				image: 'https://www.photock.jp/photo/big/photo0000-0328.jpg',
				parentTimelineTitle: 'root',
				plans: [
					{
						title: 'plan1',
						placeStartTime: new Date(2022, 9, 1, 10, 0),
						placeEndTime: new Date(2022, 9, 1, 11, 0),
					},
					{
						title: 'plan2',
						placeStartTime: new Date(2022, 9, 1, 11, 0),
						placeEndTime: new Date(2022, 9, 1, 12, 0),
					},
				],
			},
		],
		[],
	);

	const [timeline, setTimeline] = useState({} as (typeof MTilmelines)[0]);
	const [timelines, setTimelines] = useState<typeof MTilmelines>([]);
	const [timelineID, setTimelineID] = useState<string>('root');

	const fetchTimeline = useCallback(
		() =>{
			const ret = MTilmelines.find(
				(t) =>
					// 本来であれば、url から取得したい
					t.title === timelineID,
			)
			if(!ret){
				throw new Error('timeline not found')
			}
			return ret
		},
		[MTilmelines, timelineID],
	);

	const fetchTimelines = useCallback(
		() => 
			MTilmelines.filter(
				(t) =>
					// 本来であれば、url から取得したい
					t.parentTimelineTitle === timelineID,
			),
		[MTilmelines, timelineID],
	);

	useEffect(() => {
		setTimeline(fetchTimeline());
		setTimelines(fetchTimelines());
	}, [fetchTimeline, fetchTimelines]);

	// 親タイムラインを開くことで、タイムラインリストに子タイムラインを追加する
	const openTimeline = useCallback(
		(timelineTitle: string) => {
			setTimelines((val) => {
				const childTimelines = MTilmelines.filter((t) => t.parentTimelineTitle === timelineTitle);
				const index = val.findIndex((t) => t.title === timelineTitle);
				// 子タイムラインがないか、タイムラインが見つからない場合は何もしない
				if (childTimelines.length === 0 || index === -1) {
					return val;
				}
				return [...val.slice(0, index), ...childTimelines, ...val.slice(index + 1)];
			});
		},
		[MTilmelines],
	);

	// 子タイムラインを閉じることで、タイムラインリストから兄弟タイムラインを削除し、親タイムラインを表示する
	// root が見えてしまう。兄弟タイムラインが開いている可能性がある。
	// 等の理由から、実装を保留する。
	// const closeTimeline = useCallback(
	// 	(parentTimelineTitle: string) =>
	// 		setTimelines((val) => {
	// 			const parentTimeline = MTilmelines.find((timeline) => timeline.title === parentTimelineTitle);
	// 			const index = val.findIndex((timeline) => timeline.parentTimelineTitle === parentTimelineTitle);
	// 			console.log({
	// 				parentTimelineTitle,
	// 				MTilmelines,
	// 				parentTimeline,
	// 				index,
	// 			});
	// 			// 親タイムラインがないか、タイムラインが見つからない場合はエラーを出す
	// 			if (!parentTimeline || index === -1) {
	// 				throw new Error('parentTimeline not found');
	// 			}
	// 			const newVal = val.filter((timeline) => timeline.parentTimelineTitle !== parentTimelineTitle);
	// 			newVal.splice(index, 0, parentTimeline);
	// 			return newVal;
	// 		}),
	// 	[MTilmelines],
	// );

	// 新規 Timeline を登録する
	const createNewTimeline = useCallback(() => {
		// 新規 Timeline を登録する画面に遷移する
		// 遷移された画面では、Plan は初期で一つ出来ている。
		// Itinerary/TopTab/ItineraryEdit
		console.log('createNewTimeline');
	}, []);

	// Timeline を投稿済みにする
	// 子 Timeline を再帰的に投稿済みする
	const setTimelinePosted = () => {
		// firestore の posted に true を設定する
	};

	const windowWidth = getWindowWidth();

	return (
		<>
			<SafeAreaView />
			<ScrollView>
				{/* Screen Header */}
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginHorizontal: '2%',
						marginVertical: '2%',
					}}>
					<Button onPress={createNewTimeline}>createNewTimeline</Button>
				</View>

				<Pressable
					style={{
						flexDirection: 'row',
						flexWrap: 'wrap',
						width: '100%',
						justifyContent: 'center',
					}}
					onPress={() => openTimeline(timeline.title)}>
					<Image source={{ uri: timeline.image }} style={{ width: windowWidth * 0.6, height: windowWidth * 0.6 }} />
				</Pressable>

				{timelines.map((timeline, index) => (
					<Card
						key={timeline.title}
						style={{
							marginVertical: '2%',
							marginHorizontal: '1%',
							backgroundColor: materialColors[primaryColorNm]['50'],
						}}>
						{timeline.plans ? (
							// timeline.plans がある場合は、PlanGroup として表示する
							<Card.Content>
								{timeline.plans.map((plan, planIndex) => (
									<Card key={plan.title}>
										<Card.Content>
											<Pressable
												testID="planPressable"
												onPress={() => console.log('onPlanPress()')}
												style={{
													flexDirection: 'row',
													alignItems: 'center',
												}}>
												<View style={{ flex: 1, alignItems: 'center' }}>
													<MaterialCommunityIcons name="map-marker" size={20} color="black" />
												</View>
												<View style={{ flex: 13 }}>
													<Text>{plan.title || ' '}</Text>
													<View style={{ flexDirection: 'row', alignItems: 'center' }}>
														<Text>
															{DateUtils.formatToHHMM(plan.placeStartTime)}
															{plan.placeStartTime.getTime() !== plan.placeEndTime.getTime()
																? `~${DateUtils.formatToHHMM(plan.placeEndTime)}`
																: ''}
														</Text>
													</View>
												</View>

												<Menu>
													<MenuTrigger>
														<MaterialCommunityIcons name="dots-horizontal" size={30} />
													</MenuTrigger>
													<MenuOptions customStyles={{ optionsWrapper: { backgroundColor: '#F8F8FF' } }}>
														<MenuOption value={{ command: 'up', planIndex }} text={i18n.t('上へ')} />
														<MenuOption value={{ command: 'down', planIndex }} text={i18n.t('下へ')} />
														<MenuOption value={{ command: 'delete' }} text={i18n.t('削除')} />
													</MenuOptions>
												</Menu>
											</Pressable>
										</Card.Content>
									</Card>
								))}
							</Card.Content>
						) : (
							// timeline.plans がない場合は、Timeline として表示する
							// Ver 2.4 では、孫階層の Timeline を作成出来ないため、デッドロジックとなる。
							<Card.Content>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										width: '100%',
									}}>
									<Headline>{timeline.title}</Headline>
									<Menu>
										<MenuTrigger>
											<MaterialCommunityIcons name="dots-horizontal" size={30} />
										</MenuTrigger>
										<MenuOptions customStyles={{ optionsWrapper: { backgroundColor: '#F8F8FF' } }}>
											<MenuOption onSelect={() => {}} text="closeTimeline" />
										</MenuOptions>
									</Menu>
								</View>
								<Pressable
									style={{
										flexDirection: 'row',
										flexWrap: 'wrap',
										width: '100%',
										justifyContent: 'center',
									}}
									onPress={() => openTimeline(timeline.title)}>
									<Image
										source={{ uri: timeline.image }}
										style={{ width: windowWidth * 0.6, height: windowWidth * 0.6 }}
									/>
								</Pressable>
							</Card.Content>
						)}
					</Card>
				))}
			</ScrollView>
		</>
	);
};
