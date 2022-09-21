import { PDB01MPlaceInterface } from '@/Place/Models/PDB01MPlace';
import { Weaken } from '@/Common/Hooks/CHK003TypeScript';

/**
 * Export interface of PCT011MPlacesList object.
 */
export interface PCT011MPlacesListInterface extends Weaken<PDB01MPlaceInterface, 'averageStayTime' | 'createdAt' | 'updatedAt'> {
    averageStayTime: Date;
    createdAt: Date;
    updatedAt: Date;
} 