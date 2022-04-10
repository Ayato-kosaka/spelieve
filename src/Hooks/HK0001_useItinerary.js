import db from "Components/fireB/firestore"
import DB0002_Itineraries from "DB/DB0002_Itineraries.json"
import DB0004_Plans from "DB/DB0004_Plans.json"
import{ HK0002_Plan } from 'Hooks/HK0002_usePlan'
import{ HK0003_PlanGroup } from 'Hooks/HK0003_usePlanGroup'

import { doc, collection, query, where, getDoc, setDoc, getDocs, addDoc } from "firebase/firestore";



export class HK0001_Itinerary {
    static collectionName = 'Itineraries';
    static collectionRef = db.collection(HK0001_Itinerary.collectionName);
    
    async build(id){
        this.planGroups = [];
        if(id){
            this.id = id;
            this.docRef = HK0001_Itinerary.collectionRef.doc(id);
            const docSnap = await getDoc(this.docRef);
            if (!docSnap.exists()) {
                console.log("No such document!");
                return(new HK0001_Itinerary().build());
            }
            this.setter(docSnap.data());
            const querySnapshot = await this.docRef.collection(HK0003_PlanGroup.collectionName).orderBy("representiveStartTime").get()
            querySnapshot.forEach(async (subDoc) => {
                this.planGroups.push(await new HK0003_PlanGroup().build(this.id, subDoc));
            });
        }else{
            this.docRef = await addDoc(collection(db, HK0001_Itinerary.collectionName), {});
            this.id = this.docRef.id;
        }
        return(this);
    }
    setData(data){
        this.setter(data);
        setDoc(this.docRef, data, { merge: true });
    }
    async createPlanGroup() {
        this.planGroups.push(await new HK0003_PlanGroup().build(this.id));
    }
    
    //private
    setter(data) {
        this.title = data.title;
    }
    sortPlanGroups(){
        this.planGroups.sort(function (a, b) {
            return a.value - b.value;
        });
    }
};



export const BL0010_getItinerary = (itineraryID) =>{
    // let itinerary = new HK0001_Itinerary(itineraryID);
}



export const BL0014_insertItineraryTestData = async () =>{
    let itinerary = await new HK0001_Itinerary().build();
    itinerary.setData({"title": "日光・鬼怒川・中禅寺湖"});
    await itinerary.createPlanGroup();
    await itinerary.createPlanGroup();
    await itinerary.planGroups[0].insertPlan(1);
    await itinerary.planGroups[0].insertPlan(0);
    await itinerary.planGroups[0].insertPlan(0);
    await itinerary.planGroups[1].insertPlan(1);
    await itinerary.planGroups[1].insertPlan(2);
    await itinerary.planGroups[1].insertPlan(3);
    itinerary.planGroups.forEach((value_i, index_i)=>{
        value_i.setData(DB0002_Itineraries.PlanGroups[index_i]);
        value_i.plans.forEach(async (value_j, index_j)=>{
            let plan = await new HK0002_Plan().build(value_j);
            plan.setData(DB0004_Plans["plan000"+(index_j+1)]);
        });
    });
    return itinerary;


    // const itinerariesCollectionRef = db.collection('Itineraries');
    // const subCollectionName = 'PlanGroups'
    // const itineraryID = "sampleItinerary1"
    // let itinerary = DB0002_Itineraries[itineraryID];
    // Object.keys(itinerary[subCollectionName]).forEach(function(PlansGroupingsID){
    //     let itineraryPlansGrouping = itinerary[subCollectionName][PlansGroupingsID]
    //     let subsubCollectionName = "Plans"
    //     Object.keys(itineraryPlansGrouping[subsubCollectionName]).forEach(function(planID){
    //         let plan = itineraryPlansGrouping[subsubCollectionName][planID]
    //         itinerariesCollectionRef.doc(itineraryID).collection(subCollectionName).doc(PlansGroupingsID).collection(subsubCollectionName).doc(planID).set(plan)
    //     });
    //     delete itineraryPlansGrouping[subsubCollectionName];
    //     itinerariesCollectionRef.doc(itineraryID).collection(subCollectionName).doc(PlansGroupingsID).set(itineraryPlansGrouping);
    // });
    // delete itinerary[subCollectionName];
    // itinerariesCollectionRef.doc(itineraryID).set(itinerary);
    // console.log("BL0014_insertItineraryTestData finised")
}