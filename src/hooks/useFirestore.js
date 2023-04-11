import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";

const useFirestore = (collectionName, condition) => {
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    const collectionRef = collection(db, collectionName);
    const q =
      condition && condition.compareValue !== undefined
        ? query(
            collectionRef,
            where(
              condition.fieldName,
              condition.operator,
              condition.compareValue
            ),
            orderBy("createdAt", "asc")
          )
        : query(collectionRef);
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const cities = [];
      await querySnapshot.forEach((doc) => {
        const a = {
          ...doc.data(),
          id: doc.id,
        };
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
