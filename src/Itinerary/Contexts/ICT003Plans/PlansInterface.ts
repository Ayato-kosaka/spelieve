import { IDB003PlansInterface } from '@/Itinerary/Models/IDB003Plans';
import { Weaken } from '@/Common/Hooks/CHK003TypeScript';

/**
 * Export interface of ICT003Plans object.
 */
export interface ICT003PlansInterface extends Weaken<IDB003PlansInterface, 'span'> {
    span: Date;
    startTime: Date;
} 