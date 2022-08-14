import COI000TestContent from './TestContent'
import { ICT002PlanGroupsProvider } from '@/Itinerary/Contexts/ICT002PlanGroups'

export default function COI000Test() {
  
  return(
    <ICT002PlanGroupsProvider
      collectionPath="/Itineraries/nzEQO5MhckDefM4MsAC7/PlanGroups"
    >
      <COI000TestContent />
    </ICT002PlanGroupsProvider>
  )
}
