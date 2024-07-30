import { getFirestore } from "firebase/firestore";
import app from "@/lib/firbaseConfig";

const db = getFirestore(app);
export default db;
