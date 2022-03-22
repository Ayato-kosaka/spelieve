import db from "Components/fireB/firestore"
import DB0002_Itineraries from "DB/DB0002_Itineraries.json"

const collectionName = 'Itineraries';
const itinerariesCollectionRef = db.collection(collectionName);
const subCollectionName = 'PlanGroups'
const subSubCollectionName = 'Plans'

export const BL0014_insertItineraryTestData = () =>{
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

export const BL0010_getItinerary = (itineraryID) =>{
    let itinerary = {}
    itinerariesCollectionRef.doc(itineraryID).get().then((doc) => {
        if (doc.exists) {
            itinerary[itineraryID] = doc.data();
            itinerary[itineraryID][subCollectionName] = {};
            doc.ref.collection(subCollectionName).get().then((querySnapshot) => {
                querySnapshot.forEach((subDoc) => {
                    itinerary[itineraryID][subCollectionName][subDoc.id] = subDoc.data();
                    itinerary[itineraryID][subCollectionName][subDoc.id][subSubCollectionName] = {};
                    subDoc.ref.collection(subSubCollectionName).get().then((querySnapshot) => {
                        querySnapshot.forEach((subSubDoc) => {
                            itinerary[itineraryID][subCollectionName][subDoc.id][subSubCollectionName][subSubDoc.id] = subSubDoc.data();
                        });
                    });
                });
                console.log(itinerary);
                return(itinerary);
            })
            .catch((error) => {
                console.log("Error getting sub documents: ", error);
            });
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}