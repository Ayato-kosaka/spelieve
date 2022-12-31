import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	travelModeContainer: { flexDirection: 'row', flexGrow: 1, justifyContent: 'space-around' },
	travelModePressable: {
		flexDirection: 'column',
		alignItems: 'center',
	},
	travelRestrictionContainer: { flexDirection: 'row', alignItems: 'center' },
});
