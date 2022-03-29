import db from "Components/fireB/firestore"


export class Plan {
    static collectionName = 'Plans';
    
    constructor (doc){
        this.doc = doc;
        this.setData (doc.data());
    }
    setData (data) {
        this.title = data.title;
        this.span = data.span;
        this.prevPlan = data.prevPlan;
        this.nextPlan = data.nextPlan;
    }
};