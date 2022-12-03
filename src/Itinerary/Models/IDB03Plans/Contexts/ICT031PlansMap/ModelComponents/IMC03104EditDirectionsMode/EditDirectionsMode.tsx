import {
	TransitMode,
	TravelMode,
	TransitRoutingPreference,
	TravelRestriction,
} from '@googlemaps/google-maps-services-js';
import { Button, FlatList, Pressable } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { EditDirectionsModePropsInterface } from 'spelieve-common/lib/Interfaces/Itinerary/IMC03104';

import { IMC03104EditDirectionsModeController } from './EditDirectionsModeController';

import { CCO005BottomSheet } from '@/Common/Components/CCO005BottomSheet/BottomSheet';
import i18n from '@/Common/Hooks/i18n-js';
import {
	transitModeConverter,
	travelModeConverter,
	travelRestrictionConverter,
} from '@/Place/Hooks/PHK001GooglePlaceAPI';

export const IMC03104EditDirectionsMode = ({
	planID,
	bottomSheetVisible,
	setBottomSheetVisible,
}: EditDirectionsModePropsInterface) => {
	const { directionsMode, setDirectionsMode, onClose } = IMC03104EditDirectionsModeController({
		planID,
		bottomSheetVisible,
		setBottomSheetVisible,
	});

	return (
		<CCO005BottomSheet
			bottomSheetVisible={bottomSheetVisible}
			setBottomSheetVisible={setBottomSheetVisible}
			onClose={onClose}>
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
			<FlatList
				data={[TravelRestriction.highways, TravelRestriction.tolls, TravelRestriction.ferries]}
				renderItem={(renderItemInfo) => (
					<Pressable
						style={{ flexDirection: 'row', alignItems: 'center' }}
						onPress={() => {
							const travelRestrictions = [...directionsMode.avoid];
							if (travelRestrictions.includes(renderItemInfo.item)) {
								travelRestrictions.splice(travelRestrictions.indexOf(renderItemInfo.item), 1);
							} else {
								travelRestrictions.push(renderItemInfo.item);
							}
							setDirectionsMode({ ...directionsMode, avoid: travelRestrictions });
						}}>
						<Text>{travelRestrictionConverter[renderItemInfo.item].title}</Text>
						<MaterialCommunityIcons name={directionsMode.avoid.includes(renderItemInfo.item) ? 'check' : ''} />
					</Pressable>
				)}
			/>
			<Button
				title={i18n.t('決定')}
				onPress={() => {
					setBottomSheetVisible(false);
					onClose();
				}}
			/>
		</CCO005BottomSheet>
	);
};
