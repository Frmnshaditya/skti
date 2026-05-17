/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
const dbId = (firebaseConfig as any).firestoreDatabaseId;

console.log("Initializing Firestore with Project ID:", firebaseConfig.projectId, "Database ID:", dbId || "(default)");

export const db = dbId && dbId !== "(default)" ? getFirestore(app, dbId) : getFirestore(app);
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
