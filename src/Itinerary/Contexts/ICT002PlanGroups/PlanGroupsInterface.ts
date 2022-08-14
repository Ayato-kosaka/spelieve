import { IDB002PlanGroupsInterface } from '@/Itinerary/Interfaces/IDB002PlanGroupsInterface'

// TODO Utils に切り出す
type Weaken<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? any : T[P]
}

export interface ICT002PlanGroupsInterface extends Weaken<IDB002PlanGroupsInterface, 'plans'> {
    plans: Array<string>;
};