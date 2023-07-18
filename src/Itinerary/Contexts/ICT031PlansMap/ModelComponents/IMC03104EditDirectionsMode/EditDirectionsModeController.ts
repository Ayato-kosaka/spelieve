import { setDoc } from 'firebase/firestore';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { PlansMapInterface } from '../../PlansMapInterface';

import { EditDirectionsModePropsInterface } from './EditDirectionsModePropsInterface';

import { ICT031PlansMap } from '@/Itinerary/Contexts/ICT031PlansMap';

export const IMC03104EditDirectionsModeController = ({ planID }: EditDirectionsModePropsInterface) => {
	const { plansDocSnapMap } = useContext(ICT031PlansMap);
	const planDocSnap = useMemo(() => plansDocSnapMap[planID], [planID, plansDocSnapMap]);
	const plan = useMemo(() => planDocSnap.data(), [planDocSnap]);
	const [directionsMode, setDirectionsMode] = useState<
		Pick<PlansMapInterface, 'transportationMode' | 'transitModes' | 'transitRoutingPreference' | 'avoid'>
	>(
		(({ transportationMode, transitModes, transitRoutingPreference, avoid }) => ({
			transportationMode,
			transitModes,
			transitRoutingPreference,
			avoid,
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
