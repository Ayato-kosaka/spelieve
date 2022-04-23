import db from "Components/fireB/firestore"
import HK0001_useItinerary from 'Hooks/HK0001_useItinerary'

import { collection, doc, addDoc, setDoc, deleteDoc } from "firebase/firestore";



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
    update(data={}){
        this.setBody(data);
        setDoc(this.docRef(), this.getBody(), { merge: true });
    }
    delete(){
        deleteDoc(this.docRef());
    }
    insertPlan(index, planId){
        this.plans.splice(index, 0, planId);
        this.update();
    }
    deletePlan = (index, representiveStartTime) =>{ //representataivePlanが削除された場合に新しいrepresentativeStartTimeを指定する。
        let [removed] = this.plans.splice(index, 1);
        if(this.plans.length!=0){
            if(removed==this.representivePlanID){
                this.setBody({
                    'representivePlanID': this.plans[0],
                    'representiveStartTime': representiveStartTime
                })
            }
            this.update();
        }else{
            this.delete();
        }
        return removed;
    }
    swapPlan(index_i, index_j){
        let tmp = this.plans[index_i]
        this.plans[index_i] = this.plans[index_j]
        this.plans[index_j] = tmp
        this.update();
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