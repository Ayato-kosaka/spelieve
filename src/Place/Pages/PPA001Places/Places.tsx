import React from 'react';

import { PlacesPropsInterface } from 'spelieve-common/lib/Interfaces';

import { PPA001PlacesController } from './PlacesController';

import { PCO001SearchPlace } from '@/Place/Components/PCO001SearchPlace/SearchPlace';
import { PCT011MPlacesListProvider } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';
import { PMC01101GoogleMapPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList/ModelComponents/PMC01101GoogleMapPlacesList';
import { PMC01102PlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList/ModelComponents/PMC01102PlacesList';

function InnerComponent() {
	const { onAutoCompleteClicked } = PPA001PlacesController();

	return (
		<>
			<PMC01101GoogleMapPlacesList />
			<PCO001SearchPlace onAutoCompleteClicked={onAutoCompleteClicked} />
			<PMC01102PlacesList />
		</>
	);
}

export function PPA001Places({
	country,
	administrativeAreaLevel1,
	administrativeAreaLevel2,
	locality,
	navigation,
}: PlacesPropsInterface) {
	return (
		<PCT011MPlacesListProvider
			parentDocRef={undefined}
			initialCountry={country || ''}
			initialAdministrativeAreaLevel1={administrativeAreaLevel1 || ''}
			initialAdministrativeAreaLevel2={administrativeAreaLevel2 || ''}
			initialLocality={locality || ''}>
			<InnerComponent />
		</PCT011MPlacesListProvider>
	);
}
