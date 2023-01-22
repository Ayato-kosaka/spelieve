import { useState, createContext, useEffect, useMemo, ReactNode, useCallback } from 'react';
import { useSharedValue } from 'react-native-reanimated';

import { DecorationsMapValInteface } from './DecorationsMapInterface';

export const TCT023DecorationsMap = createContext({} as DecorationsMapValInteface);

export const TCT023DecorationsMapProvider = ({ children }: { children: ReactNode }) => {
	const [decorationsMap, setDecorationsMap] = useState<DecorationsMapValInteface['decorationsMap']>({});

	const decorationsCRef = 'decorationsCRef';

	useEffect(() => {
		setDecorationsMap({
			XXX: {
				decorationType: 'Figure',
				translateX: 200,
				translateY: 0,
				rotateZ: 0,
				scale: 1,
				order: 0,
				color: 'red',
			},
		});
	}, []);

	const createDecoration: DecorationsMapValInteface['createDecoration'] = useCallback(
		(data) => {
			const id = new Date().getTime().toString(); // TODO: addDoc に変更する
			setDecorationsMap({
				...decorationsMap,
				[id]: {
					...data,
					color: `#${Math.floor(Math.random() * 16777215)
						.toString(16)
						.padStart(6, '0')}`,
					order:
						Object.keys(decorationsMap).reduce(
							(prev, key) => Math.max(prev, decorationsMap[key].order),
							Number.MIN_SAFE_INTEGER,
						) + 1,
				},
			});
		},
		[decorationsMap],
	);

	const activeDecorationID = useSharedValue('');

	const value = useMemo(
		() => ({
			decorationsMap,
			setDecorationsMap,
			createDecoration,
			activeDecorationID,
			// decorationsCRef,
			// isDecorationsLoading,
		}),
		[activeDecorationID, createDecoration, decorationsMap],
	);

	return <TCT023DecorationsMap.Provider value={value}>{children}</TCT023DecorationsMap.Provider>;
};
