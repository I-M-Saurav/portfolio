import * as admin from "firebase-admin";

let initError: Error | null = null;

function formatPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  
  let formatted = key.trim();
  
  // Remove surrounding single or double quotes if present (common when copying from .env files or Vercel UI)
  if (
    (formatted.startsWith('"') && formatted.endsWith('"')) ||
    (formatted.startsWith("'") && formatted.endsWith("'"))
  ) {
    formatted = formatted.slice(1, -1);
  }
  
  // Replace literal escaped \n with actual newlines
  formatted = formatted.replace(/\\n/g, "\n");
  
  return formatted;
}

function getFirebaseAdminApp(): admin.app.App | null {
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin.apps[0];
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const rawKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  const privateKey = formatPrivateKey(rawKey);

  const missing: string[] = [];
  if (!projectId) missing.push("FIREBASE_ADMIN_PROJECT_ID");
  if (!clientEmail) missing.push("FIREBASE_ADMIN_CLIENT_EMAIL");
  if (!privateKey) missing.push("FIREBASE_ADMIN_PRIVATE_KEY");

  if (missing.length > 0) {
    const msg = `Firebase Admin initialization skipped: missing environment variables [${missing.join(", ")}].`;
    console.warn(msg);
    initError = new Error(msg);
    return null;
  }

  try {
    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId!,
        clientEmail: clientEmail!,
        privateKey: privateKey!,
      }),
    });
    initError = null;
    return app;
  } catch (error: any) {
    console.error("CRITICAL: Firebase Admin SDK initialization failed:", {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
      projectIdPresent: !!projectId,
      clientEmailPresent: !!clientEmail,
      privateKeyLength: privateKey?.length,
      privateKeyHeaderPresent: privateKey?.includes("BEGIN PRIVATE KEY"),
    });
    initError = error instanceof Error ? error : new Error(String(error));
    return null;
  }
}

export const getAdminAuth = (): admin.auth.Auth => {
  const app = getFirebaseAdminApp();
  if (!app) {
    if (admin.apps.length > 0 && admin.apps[0]) {
      return admin.auth(admin.apps[0]);
    }
    const detail = initError ? `: ${initError.message}` : "";
    throw new Error(
      `Firebase Admin SDK is not initialized${detail}. Please check Vercel environment variables (FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY).`
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
    const detail = initError ? `: ${initError.message}` : "";
    throw new Error(
      `Firebase Admin SDK is not initialized${detail}. Please check Vercel environment variables (FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY).`
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
