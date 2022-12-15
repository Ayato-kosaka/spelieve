// import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import { Dimensions, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	// list: {
	// 	width: '100%',
	// 	// flex: 3,
	// 	// flexDirection: 'row',
	// 	// alignItems: 'center',
	// 	// flexWrap: 'wrap',
	// 	// position: 'absolute', scrollできなくなる
	// 	// top: -200,
	// 	// zIndex: -1,
	// 	// marginTop: StatusBar.currentHeight || 0,
	// 	// alignSelf: "center",
	// 	// alignContentnItems: "flex-start",
	// },
	item: {
		flex: 1,
		width: '50%',
		zIndex: 0,
	},
	image: {
		paddingTop: '100%',
		width: '100%',
	},
	placeName: {
		position: 'absolute',
		top: 0,
		left: 0,
		color: 'white',
		backgroundColor: 'orange',
		padding: 2,
	},
});
