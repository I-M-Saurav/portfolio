import * as admin from "firebase-admin";

function getFirebaseAdminApp(): admin.app.App | null {
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin.apps[0];
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    return null;
  }
}

export const getAdminAuth = (): admin.auth.Auth => {
  const app = getFirebaseAdminApp();
  if (!app) {
    // If not initialized yet, initialize with default or throw runtime error when called
    if (admin.apps.length > 0 && admin.apps[0]) {
      return admin.auth(admin.apps[0]);
    }
    throw new Error(
      "Firebase Admin SDK is not configured. Please set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY in .env.local"
    );
  }
  return admin.auth(app);
};

export const getAdminDb = (): admin.firestore.Firestore => {
  const app = getFirebaseAdminApp();
  if (!app) {
    if (admin.apps.length > 0 && admin.apps[0]) {
      return admin.firestore(admin.apps[0]);
    }
    throw new Error(
      "Firebase Admin SDK is not configured. Please set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY in .env.local"
    );
  }
  return admin.firestore(app);
};

// Proxies for direct access backwards compatibility
export const adminAuth = {
  createSessionCookie: async (idToken: string, options: { expiresIn: number }) => {
    return getAdminAuth().createSessionCookie(idToken, options);
  },
  verifySessionCookie: async (sessionCookie: string, checkRevoked?: boolean) => {
    return getAdminAuth().verifySessionCookie(sessionCookie, checkRevoked);
  },
};
