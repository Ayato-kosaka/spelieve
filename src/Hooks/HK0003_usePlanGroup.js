import db from "Components/fireB/firestore"
import{ HK0002_Plan } from 'Hooks/HK0002_usePlan'
import{ HK0001_Itinerary } from 'Hooks/HK0001_useItinerary'

import { collection, addDoc, setDoc, doc } from "firebase/firestore";



export class HK0003_PlanGroup {
    static collectionName = 'PlanGroups';
    
    async build(parentId, document){
        if(document){
            this.docRef = doc(db, HK0001_Itinerary.collectionName, parentId, HK0003_PlanGroup.collectionName, document.id);
            this.id = document.id;
            this.setter(document.data());
            this.plans = document.data().plans.split(",");
        }else{ //createPlanGroup をしたとき
            let plan = await new HK0002_Plan().build();
            this.representivePlanID = plan.id;
            this.plans = [plan.id];
            this.docRef = await addDoc(collection(db, HK0001_Itinerary.collectionName, parentId, HK0003_PlanGroup.collectionName), 
                {
                    "representivePlanID": plan.id,
                    "plans": plan.id
                }
            );
            this.id = this.docRef.id;
        }
        return(this);
    }
    setData(data){
        this.setter(data);
        setDoc(this.docRef, data, { merge: true });
    }
    async insertPlan(index, planId){
        if(planId){
            this.plans.splice(index, 0, planId);
        }else{
            let plan = await new HK0002_Plan().build();
            this.plans.splice(index, 0, plan.id);
        }
        await setDoc(this.docRef, {
            "plans": this.plans.join()
        }, { merge: true });
    }
    deletePlan(planID){
        // let plan = this.removePlan(planID);
        // plan.delete();
        // delete this.plans[planID];
    }


    //private
    setter (data) {
        this.representivePlanID = data.representivePlanID;
        this.representiveStartTime = data.representiveStartTime;
    }
};