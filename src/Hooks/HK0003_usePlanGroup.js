import db from "Components/fireB/firestore"
import{ HK0002_Plan } from 'Hooks/HK0002_usePlan'

import { collection, addDoc } from "firebase/firestore";



export class HK0003_PlanGroup {
    static collectionName = 'PlanGroups';
    
    constructor (doc){
        this.doc = doc;
        this.id = doc.id;
        this.setter (doc.data());
        this.plans = {};
        doc.ref.collection(HK0002_Plan.collectionName).get().then((querySnapshot) => {
            querySnapshot.forEach((subSubDoc) => {
                this.plans[subSubDoc.id] = new HK0002_Plan(subSubDoc);
            });
        });
    }
    setData(data){
        this.setter(data);
        // await setDoc(this.doc, data);
        // return(this);
    }
    createPlan() {
        // let plan = HK0002_Plan.create(this.doc);
        // this.plans[plan.id] = plan; //plan.idがない
    }
    deletePlan(planID){
        let plan = this.removePlan(planID);
        plan.delete();
        delete this.plans[planID];
    }
    movePlanNextTo(planID, targetPlanID){ //PlanをtargetPlanの次に移動させる。
        this.removePlan(planID);
        this.insertPlanNextTo(planID, targetPlanID);
    }
    
    //private
    setter (data) {
        this.representivePlanID = data.representivePlanID;
        this.representiveStartTime = data.representiveStartTime;
        this.headPlanID = data.headPlanID;
    }
    removePlan(planID){ //Planの紐づけを外す。前後のPlanを結合させる。
        let plan = this.plans[planID];
        this.plans[plan.nextPlanID].setData({"prevPlanID": plan.prevPlanID});
        plan.setData({"nextPlanID": ""});
        this.plans[plan.prevPlanID].setData({"nextPlanID": plan.nextPlanID});
        plan.setData({"prevPlanID": ""});
        return(plan);
    }
    insertPlanNextTo(planID, targetPlanID){ //PlanをtargetPlanの次に配置する。
        let plan = this.plans[planID];
        let targetPlan = this.plans[targetPlanID];
        this.plans[targetPlan.nextPlanID].setData({"prevPlanID": planID});
        plan.setData({"nextPlanID": targetPlanID.nextPlanID});
        this.plans[targetPlanID].setData({"nextPlanID": planID});
        plan.setData({"prevPlanID": targetPlanID});
    }
    
    static create(docRef){
        // new HK0003_PlanGroup(await docRef.collection(this.collectionName).add());
    }
};