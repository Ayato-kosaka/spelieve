import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useEffect } from 'react';

import { BottomSheetPropsInterface } from 'spelieve-common/lib/Interfaces';

export const CCO005BottomSheet = ({
	children,
	bottomSheetVisible,
	setBottomSheetVisible,
	onClose,
}: BottomSheetPropsInterface) => {
	// ref
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	// variables
	const snapPoints = useMemo(() => ['25%', '50%'], []);

	useEffect(() => {
		if (bottomSheetVisible) {
			bottomSheetModalRef.current?.present();
		} else {
			bottomSheetModalRef.current?.dismiss();
		}
	}, [bottomSheetVisible]);

	const onDismiss = useCallback(() => {
		setBottomSheetVisible(false);
		onClose();
	}, [setBottomSheetVisible, onClose]);

	return (
		<BottomSheetModal ref={bottomSheetModalRef} index={1} snapPoints={snapPoints} onDismiss={onDismiss}>
			{children}
		</BottomSheetModal>
	);
};
