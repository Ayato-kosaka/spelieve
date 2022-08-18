import {
    DocumentData, 
    FirestoreDataConverter, 
    QueryDocumentSnapshot,
    SnapshotOptions } from 'firebase/firestore'
import { ItineraryType } from "./ItinerariesType";

/**
 * Firestore のドキュメントと DB0002ItinerariesType オブジェクトの型変換
 */
export const ItineraryConverter: FirestoreDataConverter<ItineraryType> = {
  /**
   * DB0002ItinerariesType オブジェクトを Firestore ドキュメントデータへ変換します。
   */
  toFirestore(itinerary: ItineraryType): DocumentData {
        // id は Firestore のパスで表現されるのでドキュメントデータには含めない。
        // 下記の updatedAt のように、自動で更新時刻のフィールドを追加することも可能。
        // return itinerary;
        return { title: itinerary.title }
  },
  /**
   * Firestore ドキュメントデータを DB0002ItinerariesType オブジェクトへ変換します。
   */
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): ItineraryType {
    const data = snapshot.data(options);
    // ItineraryType オブジェクトの id プロパティには Firestore ドキュメントの id を入れる。
    return {
        title: data.title,
    };
  },
}