import db from "Components/fireB/firestore"
import DB0002_Itineraries from "DB/DB0002_Itineraries.json"
import HK0002_usePlan from 'Hooks/HK0002_usePlan'
import HK0003_usePlanGroup from 'Hooks/HK0003_usePlanGroup'

import { doc, collection, query, where, getDoc, setDoc, getDocs, addDoc } from "firebase/firestore";



export default class HK0001_useItinerary {
    static collectionName = 'Itineraries';
    
    constructor(){
        
    }
    async build(id){
        this.planGroups = [];
        let doc;
        if(id){
            this.id = id;
            doc = await getDoc(this.docRef());
        }
        if(doc && doc.id!=='undefined'){
            this.setBody(doc.data());
        }else{
            let docRef = await addDoc(collection(db, HK0001_useItinerary.collectionName), {});
            this.id = docRef.id;
        }
        return(this);
    }
    update(data={}){
        this.setBody(data);
        setDoc(this.docRef(), this.getBody(), { merge: true });
    }
    copy(){
        let ret = new HK0001_useItinerary();
        Object.keys(this).forEach( (v) => {
            ret[v] = this[v];
        })
        return(ret);
    }
    
    //private
    setBody(data) {
        if(data.title !== undefined){
            this.title = data.title;
        }
    }
    getBody(){
        return({
            "title": this.title
        });
    }
    docRef() {
        return(doc(db, HK0001_useItinerary.collectionName, this.id));
    }
};

//---------------------------------------------


export const BL0014_insertItineraryTestData = async () =>{
    let itinerary = await new HK0001_useItinerary().build();
    itinerary.update({"title": "日光・鬼怒川・中禅寺湖"});
    let planGroups = [];
    let plans = {};
    
    //createPlanGroup
    let plan = await new HK0002_usePlan(itinerary.id).create();
    plans[plan.id] = plan;
    planGroups.push(await new HK0003_usePlanGroup(itinerary.id).create());
    planGroups[planGroups.length -1].update({
        "representivePlanID": plan.id,
        "representiveStartTime": new Date(1970, 1, 1, 0, 0, 0),
        "plans": plan.id
    });

    //updatePlanGroup
    let index = 0;
    let planGroup = planGroups[index]
    planGroup.update({
        "representiveStartTime": new Date(DB0002_Itineraries.PlanGroups[index].representiveStartTime)
    });
    //createPlan
    plan = await new HK0002_usePlan(itinerary.id).create();
    plans[plan.id] = plan;
    planGroups[index].insertPlan(0, plan.id);
    plan = await new HK0002_usePlan(itinerary.id).create();
    plans[plan.id] = plan;
    planGroups[index].insertPlan(0, plan.id);
    plan = await new HK0002_usePlan(itinerary.id).create();
    plans[plan.id] = plan;
    planGroups[index].insertPlan(3, plan.id);
    //setPlan
    planGroups[index].plans.forEach( (v,i)=>{
        plans[v].update(DB0002_Itineraries.Plans[i]);
    });


    
    //createPlanGroup
    plan = await new HK0002_usePlan(itinerary.id).create();
    plans[plan.id] = plan;
    planGroups.push(await new HK0003_usePlanGroup(itinerary.id).create());
    planGroups[planGroups.length -1].update({
        "representivePlanID": plan.id,
        "representiveStartTime": new Date(1970, 1, 1, 0, 0, 0),
        "plans": plan.id
    });

    //updatePlanGroup
    index = 1;
    planGroup = planGroups[index]
    planGroup.update({
        "representiveStartTime": new Date(DB0002_Itineraries.PlanGroups[index].representiveStartTime)
    });
    //createPlan
    plan = await new HK0002_usePlan(itinerary.id).create();
    plans[plan.id] = plan;
    planGroups[index].insertPlan(1, plan.id);
    plan = await new HK0002_usePlan(itinerary.id).create();
    plans[plan.id] = plan;
    planGroups[index].insertPlan(2, plan.id);
    plan = await new HK0002_usePlan(itinerary.id).create();
    plans[plan.id] = plan;
    planGroups[index].insertPlan(3, plan.id);
    //setPlan
    planGroups[index].plans.forEach( (v,i)=>{
        plans[v].update(DB0002_Itineraries.Plans[i+4]);
    });


    
    console.log("Test data inserted with itineary ID => " + itinerary.id)
    return itinerary;
}