import React from 'react';

export interface BottomSheetPropsInterface {
	children: React.ReactNode;
	bottomSheetVisible: boolean;
	setBottomSheetVisible: (value: React.SetStateAction<boolean>) => void;
	onClose: () => void;
}
