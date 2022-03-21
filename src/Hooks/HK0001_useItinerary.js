import db from "Components/fireB/firestore"

const collectionName = 'Itineraries';
const subCollectionName = 'ItineraryPlansGroupings'
const subSubCollectionName = 'Plans'

export const BL0010_getItinerary = (itineraryID) =>{
    let itinerary = {}
    db.collection(collectionName).doc(itineraryID).get().then((doc) => {
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