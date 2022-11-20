import { setDoc } from 'firebase/firestore';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import 'react-spring-bottom-sheet/dist/style.css';
import { PlansMapInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT031';
import {
	EditDirectionsModeControllerInterface,
	EditDirectionsModePropsInterface,
} from 'spelieve-common/lib/Interfaces/Itinerary/IMC03104';

import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';

export const IMC03104EditDirectionsModeController = ({
	planID,
}: EditDirectionsModePropsInterface): EditDirectionsModeControllerInterface => {
	const { plansDocSnapMap } = useContext(ICT031PlansMap);
	const planDocSnap = useMemo(() => plansDocSnapMap[planID], [planID, plansDocSnapMap]);
	const plan = useMemo(() => planDocSnap.data(), [planDocSnap]);
	const [directionsMode, setDirectionsMode] = useState<
		Pick<
			PlansMapInterface,
			'transportationMode' | 'transitModes' | 'transitRoutePreference' | 'avoidHighways' | 'avoidTolls' | 'avoidFerries'
		>
	>(
		(({ transportationMode, transitModes, transitRoutePreference, avoidHighways, avoidTolls, avoidFerries }) => ({
			transportationMode,
			transitModes,
			transitRoutePreference,
			avoidHighways,
			avoidTolls,
			avoidFerries,
		}))(plan),
	);

	useEffect(() => {
		setDirectionsMode(plan);
	}, [plan]);

	const onClose = useCallback(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		setDoc(planDocSnap.ref, { ...plan, ...directionsMode });
	}, [directionsMode, planDocSnap.ref, plan]);

	return { directionsMode, setDirectionsMode, onClose };
};
