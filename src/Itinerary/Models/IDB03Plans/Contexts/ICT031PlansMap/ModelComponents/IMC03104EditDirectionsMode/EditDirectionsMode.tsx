import {
	TransitMode,
	TravelMode,
	TransitRoutingPreference,
	TravelRestriction,
} from '@googlemaps/google-maps-services-js';
import { Button, Pressable, View } from 'react-native';
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
			<View style={{ flexDirection: 'row', flexGrow: 1, justifyContent: 'space-around' }}>
				{[TravelMode.walking, TravelMode.bicycling, TravelMode.driving, TravelMode.transit].map((travelMode) => (
					<Pressable
						key={travelMode}
						onPress={() => {
							setDirectionsMode({
								...directionsMode,
								transportationMode: directionsMode.transportationMode === travelMode ? undefined : travelMode,
							});
						}}
						style={{
							flexDirection: 'column',
							alignItems: 'center',
							backgroundColor: travelMode === directionsMode.transportationMode ? 'red' : 'white',
						}}>
						<MaterialCommunityIcons name={travelModeConverter[travelMode].iconName} />
						<Text>{travelModeConverter[travelMode].title}</Text>
					</Pressable>
				))}
			</View>
			<Divider />
			{directionsMode.transportationMode === TravelMode.transit && (
				<>
					<View style={{ flexDirection: 'row', flexGrow: 1, justifyContent: 'space-around' }}>
						{[TransitMode.bus, TransitMode.rail, TransitMode.subway, TransitMode.train, TransitMode.tram].map(
							(transitMode) => (
								<Pressable
									key={transitMode}
									onPress={() => {
										const transitModes = [...directionsMode.transitModes];
										if (transitModes.includes(transitMode)) {
											transitModes.splice(transitModes.indexOf(transitMode), 1);
										} else {
											transitModes.push(transitMode);
										}
										setDirectionsMode({ ...directionsMode, transitModes });
									}}
									style={{
										flexDirection: 'column',
										alignItems: 'center',
										backgroundColor: directionsMode.transitModes.includes(transitMode) ? 'red' : 'white',
									}}>
									<MaterialCommunityIcons name={transitModeConverter[transitMode].iconName} />
									<Text>{transitModeConverter[transitMode].title}</Text>
								</Pressable>
							),
						)}
					</View>
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
			<View>
				{[TravelRestriction.highways, TravelRestriction.tolls, TravelRestriction.ferries].map((travelRestriction) => (
					<Pressable
						key={travelRestriction}
						style={{ flexDirection: 'row', alignItems: 'center' }}
						onPress={() => {
							const travelRestrictions = [...directionsMode.avoid];
							if (travelRestrictions.includes(travelRestriction)) {
								travelRestrictions.splice(travelRestrictions.indexOf(travelRestriction), 1);
							} else {
								travelRestrictions.push(travelRestriction);
							}
							setDirectionsMode({ ...directionsMode, avoid: travelRestrictions });
						}}>
						<Text>{travelRestrictionConverter[travelRestriction].title}</Text>
						<MaterialCommunityIcons name={directionsMode.avoid.includes(travelRestriction) ? 'check' : ''} />
					</Pressable>
				))}
			</View>
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
