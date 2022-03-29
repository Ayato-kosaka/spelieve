import db from "Components/fireB/firestore"
import{ Plan } from 'Hooks/HK0002_usePlan'

import { collection, addDoc } from "firebase/firestore";



export class PlanGroup {
    static collectionName = 'PlanGroups';
    
    constructor (doc){
        this.doc = doc;
        this.id = doc.id;
        this.setData (doc.data());
        this.plans = {};
        doc.ref.collection(Plan.collectionName).get().then((querySnapshot) => {
            querySnapshot.forEach((subSubDoc) => {
                this.plans[subSubDoc.id] = new Plan(subSubDoc);
            });
        });
    }
    setData (data) { //BL0007_updatePlanGroup
        this.representivePlanID = data.representivePlanID;
        this.representiveStartTime = data.representiveStartTime;
        this.headPlanID = data.headPlanID;
    }
    addPlan(id, plan) {
        this.plans[id] = plan;
    }
    
    static create(ref){
        ref.collection(this.collectionName).add()
        .then((docRef) => {
            return(new PlanGroup(docRef));
        })
    }
};