import * as admin from "firebase-admin";

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.error("Firebase Admin credentials are missing in environment variables.");
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        databaseURL: "https://montetap-me-default-rtdb.europe-west1.firebasedatabase.app",
      });
    } catch (error) {
      console.error("Firebase Admin initialization error:", error);
    }
  }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { admin, adminDb, adminAuth };