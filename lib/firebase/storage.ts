/**
 * [DEPRECATED / UNUSED]
 * Profile photos and resume documents are now uploaded to Cloudinary via the server-side API route:
 * /api/upload (see app/api/upload/route.ts).
 *
 * This file is retained for reference in case Firebase Storage with a Blaze plan is needed in the future.
 */

/*
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseStorage } from "./client";

export async function uploadProfilePhoto(file: File): Promise<string> {
  const storage = getFirebaseStorage();
  const fileExtension = file.name.split(".").pop() || "png";
  const filename = `profile_${Date.now()}.${fileExtension}`;
  const storageRef = ref(storage, `profile/${filename}`);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
  });

  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}
*/
