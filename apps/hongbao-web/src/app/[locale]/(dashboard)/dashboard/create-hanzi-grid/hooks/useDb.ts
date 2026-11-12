import { IDBPDatabase, openDB } from "idb";
import { useEffect, useState } from "react";
import { FormField } from "../schemas/CreateHanziGridSchema";

export const key = "hanzi-data";

const useDb = () => {
  const [db, setDB] = useState<IDBPDatabase | null>(null);

  const getData = () => {
    if (!db) return;
    return db.get("hanzi-grid-data", key);
  };
  const setData = (val: FormField) => {
    if (!db) return;
    return db.put("hanzi-grid-data", val, key);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initDB = async () => {
      const database = await openDB("hanzi-grid-db", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("hanzi-grid-data")) {
            db.createObjectStore("hanzi-grid-data");
          }
        },
      });

      setDB(database);
    };

    initDB();
  }, []);

  return { db, getData, setData };
};

export default useDb;
