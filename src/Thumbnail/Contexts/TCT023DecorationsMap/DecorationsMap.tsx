import { useState, createContext, useEffect, useMemo, ReactNode } from 'react';

import { DecorationsMapValInteface } from './DecorationsMapInterface';

export const TCT023DecorationsMap = createContext({} as DecorationsMapValInteface);

export const TCT023DecorationsMapProvider = ({ children }: { children: ReactNode }) => {
	const [decorationsDocSnapMap, setDocumentSnapshots] = useState<DecorationsMapValInteface['decorationsDocSnapMap']>(
		{},
	);

	const decorationsCRef = 'decorationsCRef';

	useEffect(() => {
		setDocumentSnapshots({
			XXX: {
				translateX: 200,
				translateY: 0,
				rotateZ: 0,
				scale: 0,
			},
		});
	}, []);

	const value: DecorationsMapValInteface = useMemo(
		() => ({
			decorationsDocSnapMap,
			// decorationsCRef,
			// isDecorationsLoading,
		}),
		[decorationsDocSnapMap],
	);

	return <TCT023DecorationsMap.Provider value={value}>{children}</TCT023DecorationsMap.Provider>;
};
