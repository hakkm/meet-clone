import { getFirestore } from "firebase/firestore";
import app from "./fireaseConfig";

const db = getFirestore(app);
export default db;
