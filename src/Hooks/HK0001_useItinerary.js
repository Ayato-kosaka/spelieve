import db from "Components/fireB/firestore"
import DB0002_Itineraries from "DB/DB0002_Itineraries.json"
import{ PlanGroup } from 'Hooks/HK0003_usePlanGroup'

import { doc, getDoc } from "firebase/firestore";



//model はどこに配置しよう、、、、
export class Itinerary {
    static collectionName = 'Itineraries';
    static collectionRef = db.collection(this.collectionName);
    
    constructor (id) {
        
    }
    setter(data) { //BL0012_updateItinerary
        this.title = data.title;
    }
    setData(data){
        this.setter(data);
        //db.set
    }
    createPlanGroup() {
        //await　の導入から
        // this.planGroups.push(PlanGroup.create(this.collectionRef));
    }
    
    static get(id){
        let ret = new Itinerary(id);
        ret.doc.get().then((doc) => {
            if (!doc.exists) return  0;
            this.setData(doc.data());
            doc.ref.collection(PlanGroup.collectionName).orderBy("representiveStartTime").get().then((querySnapshot) => {
                this.planGroups = querySnapshot.docs.map((subDoc) => {
                    return new PlanGroup(subDoc);
                });
            })
            .catch((error) => {
                console.log("Error getting sub documents: ", error);
            });
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        
    }
};



export const BL0010_getItinerary = (itineraryID) =>{
    let itinerary = new Itinerary(itineraryID);
    console.log(itinerary);
}



export const BL0014_insertItineraryTestData = () =>{
    const itinerariesCollectionRef = db.collection('Itineraries');
    const subCollectionName = 'PlanGroups'
    const itineraryID = "sampleItinerary1"
    let itinerary = DB0002_Itineraries[itineraryID];
    Object.keys(itinerary[subCollectionName]).forEach(function(PlansGroupingsID){
        let itineraryPlansGrouping = itinerary[subCollectionName][PlansGroupingsID]
        let subsubCollectionName = "Plans"
        Object.keys(itineraryPlansGrouping[subsubCollectionName]).forEach(function(planID){
            let plan = itineraryPlansGrouping[subsubCollectionName][planID]
            itinerariesCollectionRef.doc(itineraryID).collection(subCollectionName).doc(PlansGroupingsID).collection(subsubCollectionName).doc(planID).set(plan)
        });
        delete itineraryPlansGrouping[subsubCollectionName];
        itinerariesCollectionRef.doc(itineraryID).collection(subCollectionName).doc(PlansGroupingsID).set(itineraryPlansGrouping);
    });
    delete itinerary[subCollectionName];
    itinerariesCollectionRef.doc(itineraryID).set(itinerary);
    console.log("BL0014_insertItineraryTestData finised")
}