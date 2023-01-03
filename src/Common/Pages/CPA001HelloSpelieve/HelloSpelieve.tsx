/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { DraxList, DraxProvider, DraxView } from 'react-native-drax';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';

import { BottomTabParamList } from '@/App';

export const CPA001HelloSpelieve = ({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'HelloSpelieve'>) => {
	// const [recentItineraries, setRecentItineraries] = useState<RecentItinerariesInterface | undefined>(undefined);
	// useEffect(() => {
	// 	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	// 	(async () => {
	// 		setRecentItineraries(
	// 			(await getRecentItineraries()).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
	// 		);
	// 	})();
	// });
	const draggableItemList = [
		{
			id: 1,
			name: 'A',
			background_color: 'red',
		},
		{
			id: 2,
			name: 'B',
			background_color: 'pink',
		},
		{
			id: 3,
			name: 'C',
			background_color: 'orange',
		},
		{
			id: 4,
			name: 'D',
			background_color: '#aaaaff',
		},
		{
			id: 5,
			name: 'E',
			background_color: 'blue',
		},
		// {
		// 	id: 6,
		// 	name: 'F',
		// 	background_color: 'green',
		// },
		// {
		// 	id: 7,
		// 	name: 'G',
		// 	background_color: 'brown',
		// },
		// {
		// 	id: 8,
		// 	name: 'H',
		// 	background_color: '#aaaaff',
		// },
		// {
		// 	id: 9,
		// 	name: 'I',
		// 	background_color: 'red',
		// },
		// {
		// 	id: 10,
		// 	name: 'J',
		// 	background_color: 'pink',
		// },
		// {
		// 	id: 11,
		// 	name: 'K',
		// 	background_color: 'orange',
		// },
		// {
		// 	id: 12,
		// 	name: 'L',
		// 	background_color: '#aaaaff',
		// },
	];
	const FirstReceivingItemList = [
		{
			id: 13,
			name: 'M',
			background_color: '#ffaaff',
		},
		{
			id: 14,
			name: 'N',
			background_color: '#ffaaff',
		},
		{
			id: 15,
			name: 'O',
			background_color: '#ffaaff',
		},
		{
			id: 16,
			name: 'P',
			background_color: '#ffaaff',
		},
	];
	const [receivingItemList, setReceivedItemList] = useState(FirstReceivingItemList);
	const [dragItemMiddleList, setDragItemMiddleList] = useState(draggableItemList);
	const planGroup1Ref = useRef<number | null>(null);

	return (
		// TODO: https://github.com/Ayato-kosaka/spelieve/issues/156 LP作成計画検討

		<GestureHandlerRootView style={{ flex: 1 }}>
			<Text
				style={{
					marginTop: 20,
					fontSize: 18,
					fontWeight: 'bold',
					marginLeft: 20,
				}}>
				Drag drop and swap between lists
			</Text>

			<DraxProvider>
				<DraxList
					id="planGroup1"
					data={receivingItemList}
					renderItemContent={({ item, index }, { viewState, trackingStatus }) => (
						<View key={item.id}>
							<DraxView
								style={[styles.centeredContent, styles.draggableBox, { backgroundColor: item.background_color }]}
								draggingStyle={styles.dragging}
								dragReleasedStyle={styles.dragging}
								hoverDraggingStyle={styles.hoverDragging}
								dragPayload={{ item, index }}
								id={item.id.toString()}>
								<Text style={styles.textStyle}>Plan-{item.name}</Text>
							</DraxView>
							<DraxView
								// otherDraggingWithoutReceiverStyle={{ display: 'none', backgroundColor: 'red' }}
								onReceiveDragDrop={(event) => {
									console.log('planGroup1 AddPlan :: onReceiveDragDrop', JSON.stringify(event, null, '\t'));
								}}
								receivingStyle={styles.receiving}
								renderContent={() => {
									const isAnyPlanInTheSamePlanGroupDragging = false;
									if (isAnyPlanInTheSamePlanGroupDragging) {
										return <View />;
									}
									return (
										// const receivingDrag = viewState && viewState.receivingDrag;
										// const payload = receivingDrag && receivingDrag.payload;
										<View style={[styles.centeredContent, styles.draggableBox, { backgroundColor: 'white' }]}>
											<Text style={styles.textStyle}>Add Plan{item.name}</Text>
										</View>
									);
								}}
							/>
						</View>
					)}
					onItemReorder={({ fromItem, fromIndex, toItem, toIndex }) => {
						console.log('debug onItemReorder=::{ fromIndex, toIndex }', fromItem, fromIndex, toItem, toIndex);
						const newDragItemMiddleList = [...receivingItemList];
						newDragItemMiddleList.splice(toIndex, 0, newDragItemMiddleList.splice(fromIndex, 1)[0]);
						setReceivedItemList(newDragItemMiddleList);
					}}
					keyExtractor={(item) => item.id.toString()}
				/>
				<DraxList
					id="planGroup2"
					data={dragItemMiddleList}
					renderItemContent={({ item, index }) => (
						<DraxView
							style={[styles.centeredContent, styles.draggableBox, { backgroundColor: item.background_color }]}
							draggingStyle={styles.dragging}
							dragReleasedStyle={styles.dragging}
							hoverDraggingStyle={styles.hoverDragging}
							dragPayload={{ item, index }}
							key={item.id}>
							<Text style={styles.textStyle}>{item.name}</Text>
						</DraxView>
					)}
					onItemReorder={({ fromItem, fromIndex, toItem, toIndex }) => {
						console.log('debug onItemReorder=::{ fromIndex, toIndex }', fromItem, fromIndex, toItem, toIndex);
						const newDragItemMiddleList = [...dragItemMiddleList];
						newDragItemMiddleList.splice(toIndex, 0, newDragItemMiddleList.splice(fromIndex, 1)[0]);
						setDragItemMiddleList(newDragItemMiddleList);
					}}
					keyExtractor={(item) => item.name}
				/>
			</DraxProvider>

			{/* Ver2 */}
			{/* <DraxProvider>
				<DraxView
					receivingStyle={styles.receiving}
					renderContent={({ viewState }) => (
						<DraxList
							data={receivingItemList}
							renderItemContent={({ item, index }) => (
								<DraxView
									style={[styles.centeredContent, styles.draggableBox, { backgroundColor: item.background_color }]}
									draggingStyle={styles.dragging}
									dragReleasedStyle={styles.dragging}
									hoverDraggingStyle={styles.hoverDragging}
									dragPayload={{ item, index }}
									key={item.id}
									id={item.id.toString()}
									parent={{ id: 'PlanGroup1', nodeHandleRef: planGroup1Ref }}>
									<Text style={styles.textStyle}>{item.name}</Text>
								</DraxView>
							)}
							onItemReorder={({ fromItem, fromIndex, toItem, toIndex }) => {
								console.log('debug onItemReorder=::{ fromIndex, toIndex }', fromItem, fromIndex, toItem, toIndex);
								const newDragItemMiddleList = [...receivingItemList];
								newDragItemMiddleList.splice(toIndex, 0, newDragItemMiddleList.splice(fromIndex, 1)[0]);
								setReceivedItemList(newDragItemMiddleList);
							}}
							keyExtractor={(item) => item.name}
						/>
					)}
					// onReceiveDragDrop={(event) => {
					// 	console.log('onReceiveDragDrop', event);
					// }}
					isParent
					id="PlanGroup1"
				/>
				<DraxList
					data={dragItemMiddleList}
					renderItemContent={({ item, index }) => (
						<DraxView
							style={[styles.centeredContent, styles.draggableBox, { backgroundColor: item.background_color }]}
							draggingStyle={styles.dragging}
							dragReleasedStyle={styles.dragging}
							hoverDraggingStyle={styles.hoverDragging}
							dragPayload={{ item, index }}
							key={item.id}>
							<Text style={styles.textStyle}>{item.name}</Text>
						</DraxView>
					)}
					onItemReorder={({ fromItem, fromIndex, toItem, toIndex }) => {
						console.log('debug onItemReorder=::{ fromIndex, toIndex }', fromItem, fromIndex, toItem, toIndex);
						const newDragItemMiddleList = [...dragItemMiddleList];
						newDragItemMiddleList.splice(toIndex, 0, newDragItemMiddleList.splice(fromIndex, 1)[0]);
						setDragItemMiddleList(newDragItemMiddleList);
					}}
					keyExtractor={(item) => item.name}
				/>
			</DraxProvider> */}

			{/* Ver 1 */}
			{/* <DraxProvider>
				<View style={styles.container}>
					<View style={styles.receivingContainer}>
						{receivingItemList.map((item, index) => (
							<DraxView
								style={[styles.centeredContent, styles.receivingZone, { backgroundColor: item.background_color }]}
								receivingStyle={styles.receiving}
								renderContent={({ viewState }) => (
									// const receivingDrag = viewState && viewState.receivingDrag;
									// const payload = receivingDrag && receivingDrag.payload;
									<View>
										<Text style={styles.textStyle}>{item.name}</Text>
									</View>
								)}
								key={item.id}
								onReceiveDragDrop={(event) => {
									const selectedItem = dragItemMiddleList[event.dragged.payload as number];
									console.log('onReceiveDragDrop::index', selectedItem, index);
									console.log('onReceiveDragDrop :: payload', event.dragged.payload);
									const newReceivingItemList = [...receivingItemList];
									console.log(
										'onReceiveDragDrop :: newReceivingItemList',
										JSON.stringify(newReceivingItemList, null, '\t'),
									);
									newReceivingItemList[index] = selectedItem;
									setReceivedItemList(newReceivingItemList);

									const newDragItemMiddleList = [...dragItemMiddleList];
									console.log(
										'onReceiveDragDrop :: newDragItemMiddleList 1',
										JSON.stringify(newDragItemMiddleList, null, '\t'),
									);
									newDragItemMiddleList[event.dragged.payload as number] = receivingItemList[index];
									console.log(
										'onReceiveDragDrop :: newDragItemMiddleList 2',
										JSON.stringify(newDragItemMiddleList, null, '\t'),
									);
									setDragItemMiddleList(newDragItemMiddleList);
								}}
							/>
						))}
					</View>
					<View style={styles.draxListContainer}>
						<DraxList
							data={dragItemMiddleList}
							renderItemContent={({ item, index }) => (
								<DraxView
									style={[styles.centeredContent, styles.draggableBox, { backgroundColor: item.background_color }]}
									draggingStyle={styles.dragging}
									dragReleasedStyle={styles.dragging}
									hoverDraggingStyle={styles.hoverDragging}
									dragPayload={index}
									longPressDelay={150}
									key={item.id}>
									<Text style={styles.textStyle}>{item.name}</Text>
								</DraxView>
							)}
							onItemReorder={({ fromIndex, toIndex }) => {
								console.log('debug onItemReorder=::{ fromIndex, toIndex }', fromIndex, toIndex);
								const newDragItemMiddleList = [...dragItemMiddleList];
								newDragItemMiddleList.splice(toIndex, 0, newDragItemMiddleList.splice(fromIndex, 1)[0]);
								setDragItemMiddleList(newDragItemMiddleList);
							}}
							keyExtractor={(item, index) => item.id.toString()}
							numColumns={1}
							scrollEnabled
						/>
					</View>
				</View>
			</DraxProvider> */}
		</GestureHandlerRootView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 12,
		paddingTop: 40,
		justifyContent: 'space-evenly',
	},
	centeredContent: {
		borderRadius: 10,
	},
	receivingZone: {
		height: Dimensions.get('window').width / 4 - 12,
		borderRadius: 10,
		width: Dimensions.get('window').width / 4 - 12,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 5,
	},
	receiving: {
		borderColor: 'red',
		borderWidth: 2,
	},
	draggableBox: {
		width: '100%',
		height: 50,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 5,
	},
	dragging: {
		opacity: 0.2,
	},
	hoverDragging: {
		borderColor: 'magenta',
		borderWidth: 2,
	},
	receivingContainer: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
	},
	itemSeparator: {
		height: 15,
	},
	draxListContainer: {
		padding: 5,
		height: 200,
	},
	receivingZoneContainer: {
		padding: 5,
		height: 100,
	},
	textStyle: {
		fontSize: 18,
	},
	headerStyle: {
		marginTop: 20,
		fontSize: 18,
		fontWeight: 'bold',
		marginLeft: 20,
	},
});
