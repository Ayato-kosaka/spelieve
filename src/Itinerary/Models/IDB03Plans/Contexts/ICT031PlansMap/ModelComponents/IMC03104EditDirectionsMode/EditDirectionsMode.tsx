import { TransitMode, TravelMode, TransitRoutingPreference } from '@googlemaps/google-maps-services-js';
import { useContext } from 'react';
import { Button, FlatList, Pressable } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomSheet } from 'react-spring-bottom-sheet';

import { EditDirectionsModePropsInterface } from 'spelieve-common/lib/Interfaces/Itinerary/IMC03104';

import { IMC03104EditDirectionsModeController } from './EditDirectionsModeController';

import i18n from '@/Common/Hooks/i18n-js';
import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';

import 'react-spring-bottom-sheet/dist/style.css';

export const IMC03104EditDirectionsMode = ({
	planID,
	bottomSheetVisible,
	setBottomSheetVisible,
}: EditDirectionsModePropsInterface) => {
	const { travelModeConverter, transitModeConverter } = useContext(ICT031PlansMap);
	const { directionsMode, setDirectionsMode, onClose } = IMC03104EditDirectionsModeController({
		planID,
		bottomSheetVisible,
		setBottomSheetVisible,
	});

	/* TO @Takapy: BottomSheetのコンポーネントがiOSで使えるか確認してほしい！ */
	return (
		<BottomSheet
			open={bottomSheetVisible}
			onDismiss={() => {
				setBottomSheetVisible(false);
				onClose();
			}}
			snapPoints={({ minHeight }) => minHeight}>
			<FlatList
				data={[TravelMode.walking, TravelMode.bicycling, TravelMode.driving, TravelMode.transit]}
				horizontal
				renderItem={(renderItemInfo) => (
					<Pressable
						onPress={() => {
							setDirectionsMode({
								...directionsMode,
								transportationMode:
									directionsMode.transportationMode === renderItemInfo.item ? undefined : renderItemInfo.item,
							});
						}}
						style={{
							flexDirection: 'column',
							alignItems: 'center',
							backgroundColor: renderItemInfo.item === directionsMode.transportationMode ? 'red' : 'white',
						}}>
						<MaterialCommunityIcons name={travelModeConverter[renderItemInfo.item].iconName} />
						<Text>{travelModeConverter[renderItemInfo.item].title}</Text>
					</Pressable>
				)}
				contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-around' }}
			/>
			<Divider />
			{directionsMode.transportationMode === TravelMode.transit && (
				<>
					<FlatList
						data={[TransitMode.bus, TransitMode.rail, TransitMode.subway, TransitMode.train, TransitMode.tram]}
						horizontal
						renderItem={(renderItemInfo) => (
							<Pressable
								onPress={() => {
									const transitModes = [...directionsMode.transitModes];
									if (transitModes.includes(renderItemInfo.item)) {
										transitModes.splice(transitModes.indexOf(renderItemInfo.item), 1);
									} else {
										transitModes.push(renderItemInfo.item);
									}
									setDirectionsMode({ ...directionsMode, transitModes });
								}}
								style={{
									flexDirection: 'column',
									alignItems: 'center',
									backgroundColor: directionsMode.transitModes.includes(renderItemInfo.item) ? 'red' : 'white',
								}}>
								<MaterialCommunityIcons name={transitModeConverter[renderItemInfo.item].iconName} />
								<Text>{transitModeConverter[renderItemInfo.item].title}</Text>
							</Pressable>
						)}
						contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-around' }}
					/>
					<Divider />
					<Pressable
						style={{ flexDirection: 'row', alignItems: 'center' }}
						onPress={() =>
							setDirectionsMode({
								...directionsMode,
								transitRoutingPreference: TransitRoutingPreference.fewer_transfers,
							})
						}>
						<Text>{i18n.t('乗り換えが少ないルート')}</Text>
						<MaterialCommunityIcons
							name={
								directionsMode.transitRoutingPreference === TransitRoutingPreference.fewer_transfers
									? 'checkbox-blank-circle'
									: ''
							}
						/>
					</Pressable>
					<Pressable
						style={{ flexDirection: 'row', alignItems: 'center' }}
						onPress={() =>
							setDirectionsMode({
								...directionsMode,
								transitRoutingPreference: TransitRoutingPreference.less_walking,
							})
						}>
						<Text>{i18n.t('歩きが少ないルート')}</Text>
						<MaterialCommunityIcons
							name={
								directionsMode.transitRoutingPreference === TransitRoutingPreference.less_walking
									? 'checkbox-blank-circle'
									: ''
							}
						/>
					</Pressable>
					<Divider />
				</>
			)}
			<Pressable
				style={{ flexDirection: 'row', alignItems: 'center' }}
				onPress={() => {
					setDirectionsMode({ ...directionsMode, avoidHighways: !directionsMode.avoidHighways });
				}}>
				<Text>{i18n.t('Avoid highways')}</Text>
				<MaterialCommunityIcons name={directionsMode.avoidHighways ? 'check' : ''} />
			</Pressable>
			<Pressable
				style={{ flexDirection: 'row', alignItems: 'center' }}
				onPress={() => {
					setDirectionsMode({ ...directionsMode, avoidTolls: !directionsMode.avoidTolls });
				}}>
				<Text>{i18n.t('Avoid tolls')}</Text>
				<MaterialCommunityIcons name={directionsMode.avoidTolls ? 'check' : ''} />
			</Pressable>
			<Pressable
				style={{ flexDirection: 'row', alignItems: 'center' }}
				onPress={() => {
					setDirectionsMode({ ...directionsMode, avoidFerries: !directionsMode.avoidFerries });
				}}>
				<Text>{i18n.t('Avoid ferries')}</Text>
				<MaterialCommunityIcons name={directionsMode.avoidFerries ? 'check' : ''} />
			</Pressable>
			<Button
				title={i18n.t('決定')}
				onPress={() => {
					setBottomSheetVisible(false);
					onClose();
				}}
			/>
		</BottomSheet>
	);
};
