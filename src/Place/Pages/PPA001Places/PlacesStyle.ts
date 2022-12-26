import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		// display: 'flex',
		flex: 1,
		flexDirection: 'column',
		// zIndex: 0,
	},
	googleMap: {
		flex: 3,
		zIndex: 0,
		// top: -200,
	},
	searchPlace: {
		flex: 1,
		zIndex: 2,
	},
	placesList: {
		flex: 6,
		zIndex: 0,
	},
});
