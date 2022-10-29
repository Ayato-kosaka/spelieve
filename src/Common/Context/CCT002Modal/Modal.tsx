// import { useState, createContext, useMemo, ReactNode } from 'react';
// import { Modal, TouchableWithoutFeedback, View } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// export const CCT002Modal = createContext({} as ModalValInterface);

// // TODO Spelieve-common に修正する
// interface ModalStateInterface {
// 	visible: boolean;
// 	hideLocationY: number;
// 	modalContent: ReactNode;
// }
// interface ModalValInterface {
// 	setModalVal: React.Dispatch<React.SetStateAction<ModalStateInterface>>;
// }
// interface ModalProviderPropsInterface {
// 	children: ReactNode;
// }

// export function CCT002ModalProvider({ children }: ModalProviderPropsInterface) {
// 	const [modalVal, setModalVal] = useState<ModalStateInterface>({
// 		visible: false,
// 		hideLocationY: 150,
// 		modalContent: <></>,
// 	});

// 	const value: ModalValInterface = useMemo(
// 		() => ({
// 			setModalVal,
// 		}),
// 		[setModalVal],
// 	);

// 	return (
// 		<CCT002Modal.Provider value={value}>
// 			<Modal
// 				visible={modalVal.visible}
// 				animationType="slide"
// 				onDismiss={() => console.log('on ddismiss')}
// 				onRequestClose={() => setModalVal({ ...modalVal, visible: false })}
// 				style={{
// 					margin: 0,
// 					backgroundColor: 'white',
// 					height: 100,
// 					flex: 0,
// 					bottom: 0,
// 					position: 'absolute',
// 					width: '100%',
// 				}}>
// 				<View style={{ flex: 1 }}>
// 					<TouchableWithoutFeedback
// 						onPressOut={(e) => {
// 							if (e.nativeEvent.locationY > modalVal.hideLocationY) {
// 								setModalVal({ ...modalVal, visible: false });
// 							}
// 						}}>
// 						<View>
// 							<MaterialCommunityIcons name="drag-horizontal-variant" color="#ddd" />
// 						</View>
// 					</TouchableWithoutFeedback>
// 					{modalVal.modalContent}
// 				</View>
// 			</Modal>
// 			{children}
// 		</CCT002Modal.Provider>
// 	);
// }
