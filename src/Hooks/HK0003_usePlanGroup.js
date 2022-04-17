import db from "Components/fireB/firestore"
import HK0001_useItinerary from 'Hooks/HK0001_useItinerary'

import { collection, addDoc, setDoc, doc } from "firebase/firestore";



export default class HK0003_usePlanGroup {
    static collectionName = 'PlanGroups';
    
    constructor(itineraryId, id){
        this.itineraryId = itineraryId;
        this.id = id;
    }
    async create(){
        let docRef = await addDoc(collection(db, HK0001_useItinerary.collectionName, this.itineraryId, HK0003_usePlanGroup.collectionName), {});
        this.id = docRef.id;
        return(this);
    }
    update(data){
        this.setBody(data);
        setDoc(this.docRef(), this.getBody(), { merge: true });
    }
    insertPlan(index, planId){
        this.plans.splice(index, 0, planId);
        this.update();
    }
    deletePlan = (index) =>{
        let [removed] = this.plans.splice(index, 1);
        return removed;
    }


    //private
    setBody (data={}) {
        if(data.representivePlanID !== undefined){
            this.representivePlanID = data.representivePlanID;
        }
        if(data.representiveStartTime !== undefined){
            this.representiveStartTime = (data.representiveStartTime instanceof Date) ? data.representiveStartTime : data.representiveStartTime.toDate();
        }
        if(data.plans !== undefined){
            this.plans = Array.isArray(data.plans) ? data.plans : (data.plans ? data.plans.split(",") : []);
        }
    }
    getBody(){
        let ret = {};
        if(this.plans){ ret.plans = this.getPlans(); }
        if(this.representivePlanID){ ret.representivePlanID = this.representivePlanID }
        if(this.representiveStartTime){ ret.representiveStartTime = this.representiveStartTime }
        return(ret);
    }
    getPlans(){
        return(this.plans.join());
    }
    docRef() {
        return(doc(db, HK0001_useItinerary.collectionName, this.itineraryId, HK0003_usePlanGroup.collectionName, this.id));
    }

    //Class method
    static async getPlanGroups(itineraryId){
        let ret = [];
        const querySnapshot = await db.collection(HK0001_useItinerary.collectionName).doc(itineraryId).collection(HK0003_usePlanGroup.collectionName).orderBy("representiveStartTime", "desc").get()
        querySnapshot.forEach(async (doc) => {
            let planGroup = new HK0003_usePlanGroup(itineraryId, doc.id);
            planGroup.setBody(doc.data());
            ret.push(planGroup);
        });
        return(ret);
    }
};