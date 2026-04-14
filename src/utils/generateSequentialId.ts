import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

export async function generateSequentialId(
  collectionName: string,
  prefix: string,
  padding: number,
  idField: string = "id"
): Promise<string> {
  const q = query(
    collection(db, collectionName),
    orderBy(idField, "desc"),
    limit(1)
  );
  
  const querySnapshot = await getDocs(q);
  
  let startingNumber = 1;
  if (prefix === "idea_") startingNumber = 7;
  if (prefix === "hist_") startingNumber = 14;

  if (querySnapshot.empty) {
    return `${prefix}${startingNumber.toString().padStart(padding, "0")}`;
  }

  const latestDoc = querySnapshot.docs[0].data();
  const latestId = latestDoc[idField] || ""; 
  
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
  
  const match = latestId.match(new RegExp(`^${escapeRegExp(prefix)}(\\d+)$`));
  
  if (match && match[1]) {
    const num = parseInt(match[1], 10);
    const nextNum = num + 1;
    const finalNum = Math.max(nextNum, startingNumber);
    return `${prefix}${finalNum.toString().padStart(padding, "0")}`;
  }

  return `${prefix}${startingNumber.toString().padStart(padding, "0")}`;
}
