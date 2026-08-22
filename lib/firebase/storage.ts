import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseStorage } from "./client";

/**
 * Uploads a profile image file to Firebase Storage under the "profile/" directory
 * and returns the public download URL.
 */
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
