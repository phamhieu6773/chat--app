import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";

const useFirestore = (collectionName, condition) => {
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    const collectionRef = collection(db, collectionName);
    const q = condition && condition.compareValue !== undefined 
      ? query(
          collectionRef,
          where(
            condition.fieldName,
            condition.operator,
            condition.compareValue
          )
        )
      : query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
        const a = {
          ...doc.data(),
          id: doc.id
        }
        cities.push(a);
      });
      setDocuments(cities);
    });

    return () => {
      unsubscribe();
    };
  }, [collectionName, condition]);
  return documents;
};

export default useFirestore;