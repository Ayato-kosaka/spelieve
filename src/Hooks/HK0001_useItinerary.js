import db from "Components/fireB/firestore"
import DB0002_Itineraries from "DB/DB0002_Itineraries.json"
import{ HK0003_PlanGroup } from 'Hooks/HK0003_usePlanGroup'

import { doc, collection, query, where, getDocs } from "firebase/firestore";



//model はどこに配置しよう、、、、
//docRef と doc の違いがよくわかっていないいいいいいいいいいいいいいいいい
export class HK0001_Itinerary {
    static collectionName = 'Itineraries';
    // static collectionRef = db.collection(this.collectionName); //←いらないかなぁあああ？
    
    
    constructor (id) { //await が無理なら、new HK0001_Itinerary().build(id) でも良い。
        // if(!id){
        //     this.docRef = await addDoc(collection(db, this.collectionName));
        //     this.id = docRef.id;
        // }else{
        //     this.id = id;
        //     this.docRef = doc(db, this.collectionName, id);
        //     let doc = await getDoc(this.docRef);
        //     this.setter(doc.data());
        //     const subCollection = await doc.ref.collection(HK0003_PlanGroup.collectionName).orderBy("representiveStartTime").get()
        //     this.planGroups = subCollection.map((subDoc) => {
        //         return new HK0003_PlanGroup(subDoc);
        //     });
        // }
        // return(this);
    }
    setData(data){
        this.setter(data);
        // await setDoc(this.docRef, data);
        // return(this);
    }
    createPlanGroup() {
        this.planGroups.push(HK0003_PlanGroup.create(this.docRef));
    }
    
    //private
    setter(data) {
        this.title = data.title;
    }
};



export const BL0010_getItinerary = (itineraryID) =>{
    // let itinerary = new HK0001_Itinerary(itineraryID);
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