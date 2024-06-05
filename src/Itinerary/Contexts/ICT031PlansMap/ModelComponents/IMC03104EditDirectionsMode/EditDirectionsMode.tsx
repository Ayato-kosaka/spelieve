import {
	TransitMode,
	TravelMode,
	TransitRoutingPreference,
	TravelRestriction,
} from '@googlemaps/google-maps-services-js';
import { Pressable, View } from 'react-native';
import { Checkbox, Divider, Text, Button } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { IMC03104EditDirectionsModeController } from './EditDirectionsModeController';
import { EditDirectionsModePropsInterface } from './EditDirectionsModePropsInterface';
import { styles } from './EditDirectionsModeStyle';

import { CCO005BottomSheet } from '@/Common/Components/CCO005BottomSheet/BottomSheet';
import i18n from '@/Common/Hooks/i18n-js';
import {
	transitModeConverter,
	travelModeConverter,
	travelRestrictionConverter,
} from '@/Place/Hooks/PHK001GooglePlaceAPI';
import { materialColors, secondaryColorNm } from '@/ThemeProvider';

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
			<View style={{ justifyContent: 'flex-start' }}>
				<View style={styles.travelModeContainer}>
					{[TravelMode.walking, TravelMode.bicycling, TravelMode.driving].map((travelMode) => (
						<Pressable
							key={travelMode}
							onPress={() => {
								setDirectionsMode({
									...directionsMode,
									transportationMode: directionsMode.transportationMode === travelMode ? undefined : travelMode,
								});
							}}
							style={styles.travelModePressable}>
							<MaterialCommunityIcons
								name={travelModeConverter[travelMode].iconName}
								color={
									directionsMode.transportationMode === travelMode ? materialColors[secondaryColorNm].a400 : 'black'
								}
							/>
							<Text
								style={{
									color:
										directionsMode.transportationMode === travelMode ? materialColors[secondaryColorNm].a400 : 'black',
								}}>
								{travelModeConverter[travelMode].title}
							</Text>
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
							<Text>{i18n.t('Route with Fewest transfer')}</Text>
							{directionsMode.transitRoutingPreference ? <MaterialCommunityIcons
								name="checkbox-blank-circle"
							/> : <View/>}
						</Pressable>
						<Pressable
							style={{ flexDirection: 'row', alignItems: 'center' }}
							onPress={() =>
								setDirectionsMode({
									...directionsMode,
									transitRoutingPreference: TransitRoutingPreference.less_walking,
								})
							}>
							<Text>{i18n.t('Route with Shortest walking distance')}</Text>
							{directionsMode.transitRoutingPreference === TransitRoutingPreference.less_walking ? <MaterialCommunityIcons
								name="checkbox-blank-circle"
							/> : <View/>
						</Pressable>
						<Divider />
					</>
				)}
				<View>
					{[TravelRestriction.highways, TravelRestriction.tolls, TravelRestriction.ferries].map((travelRestriction) => (
						<Pressable
							key={travelRestriction}
							style={styles.travelRestrictionContainer}
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
							<Checkbox.IOS
								status={directionsMode.avoid.includes(travelRestriction) ? 'checked' : 'unchecked'}
								color={materialColors[secondaryColorNm].a400}
							/>
						</Pressable>
					))}
				</View>
				<Button
					onPress={() => {
						setBottomSheetVisible(false);
						onClose();
					}}>
					{i18n.t('Select')}
				</Button>
			</View>
		</CCO005BottomSheet>
	);
};
