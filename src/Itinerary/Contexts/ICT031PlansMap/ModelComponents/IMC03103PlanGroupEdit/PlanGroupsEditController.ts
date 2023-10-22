import { QueryDocumentSnapshot, setDoc } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState, useContext } from 'react';

import { ICT031PlansMap } from '../../PlansMap';

import { PlanGroupsListInterface } from '@/Itinerary/Contexts/ICT021PlanGroupsList/PlanGroupsListInterface';

export const IMC03103PlanGroupsEditController = ({
	planGroupsDoc,
}: {
	planGroupsDoc: QueryDocumentSnapshot<PlanGroupsListInterface>;
}) => {
	const planGroups = planGroupsDoc.data();
	const { createPlan, plansDocSnapMap } = useContext(ICT031PlansMap);

	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const addFirstPlan = useCallback(async () => {
		const firstPlan = plansDocSnapMap[planGroups.plans[0]].data();
		const planDocRef = await createPlan({
			placeStartTime: firstPlan.placeStartTime,
			placeEndTime: firstPlan.placeStartTime,
		});
		await setDoc(planGroupsDoc.ref, { plans: [planDocRef.id, ...planGroups.plans] }, { merge: true });
	}, [createPlan, planGroups.plans, planGroupsDoc.ref, plansDocSnapMap]);

	const draxItemList = useMemo(() => {
		let representativeFounded = false;
		return planGroups.plans.map((planID, index) => {
			const beforeAfterRepresentativeType: 'after' | 'representative' | 'before' = (() => {
				if (representativeFounded) {
					return 'after';
				}
				if (planID === planGroups.representativePlanID) {
					representativeFounded = true;
					return 'representative';
				}
				return 'before';
			})();
			const dependentPlanID = (() => {
				if (beforeAfterRepresentativeType === 'before') {
					return planGroups.plans[index + 1];
				}
				if (beforeAfterRepresentativeType === 'after') {
					return planGroups.plans[index - 1];
				}
				return planID;
			})();
			return {
				planID,
				index,
				beforeAfterRepresentativeType,
				dependentPlanID,
			};
		});
	}, [planGroups.plans, planGroups.representativePlanID]);

	return { isMounted, addFirstPlan, draxItemList };
};
