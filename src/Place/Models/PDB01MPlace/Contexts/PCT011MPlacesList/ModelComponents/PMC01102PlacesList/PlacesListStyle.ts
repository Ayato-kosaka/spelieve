// import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
	list: {
		width: '100%',
		// flex: 3,
		// flexDirection: 'row',
		// alignItems: 'center',
		// flexWrap: 'wrap',
		// position: 'absolute', scrollできなくなる
		// top: -200,
		// zIndex: -1,
		// marginTop: StatusBar.currentHeight || 0,
		// alignSelf: "center",
		// alignContentnItems: "flex-start",
	},
	item: {
		width: '50%',
	},
	image: {
		height: 200,
		// height: WINDOW_WIDTH / 2,
		// marginHorizontal: 10,
	},
	placeName: {
		position: 'absolute',
		top: 0,
		left: 0,
		color: 'black',
		backgroundColor: 'darkgrey',
	},
});
