import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { orderBy } from "lodash";

const useFirestore = (collectionName, condition) => {
  // console.log(condition.compareValue);
  // console.log(condition);
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
    // const unsub = onSnapshot(doc(db, "rooms", "Ai7YDyV9bqfZ8bBCzqGF"), (doc) => {
    //   const a = {
    //     ...doc.data(),
    //     id: doc.id
    //   }
    //   setDocuments([a]);
    // });
    // return () => {
    //   unsub();
    // }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
        const a = {
          ...doc.data(),
          id: doc.id
        }
        // console.log(a);
        cities.push(a);
      });
      // console.log(cities);
      setDocuments(cities);
    });

    return () => {
      unsubscribe();
    };
  }, [collectionName, condition]);
  return documents;
};

export default useFirestore;

// import {
//   collection,
//   query,
//   where,
//   orderBy,
//   onSnapshot,
//   getDocs,
//   doc,
// } from "firebase/firestore";
// import { useState, useEffect } from "react";
// import { db } from "../firebase/config";
// //import your firebase instance

// const useFirestore = (collectionName) => {

//   const [documents, setDocuments] = useState([]);

//   useEffect(() => {
//     const getChats = () => {
//       const unsub =  onSnapshot(doc(db, collection, "9LWZpvvjuORA36f0028KYnHU2Cm1"), (doc) => {
//         // console.log(doc.data());
//       })

//     }
//   }, )
// };

// export default useFirestore;
