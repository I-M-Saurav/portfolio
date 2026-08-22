import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { adminAuth } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

// Configure Cloudinary using server-side environment variables
function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verify authenticated admin session
    const sessionCookie = request.cookies.get("__session")?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    try {
      await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (authErr: any) {
      console.error("Admin verification failed in upload route:", authErr);
      return NextResponse.json(
        { error: "Session expired or invalid. Please log in again." },
        { status: 401 }
      );
    }

    // 2. Verify Cloudinary configuration
    const cld = getCloudinary();
    if (!cld) {
      console.error("Missing Cloudinary environment variables.");
      return NextResponse.json(
        {
          error:
            "Cloudinary is not configured. Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in environment variables.",
        },
        { status: 500 }
      );
    }

    // 3. Extract form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string | null) || "photo";

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    let folder = "portfolio/profile";
    let resourceType: "image" | "raw" = "image";
    let publicId: string | undefined = undefined;

    // 4. Validate file based on upload type
    if (type === "photo") {
      const allowedImageTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
        "image/gif",
        "image/svg+xml",
      ];
      if (!allowedImageTypes.includes(file.type) && !file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Invalid image format. Allowed formats: JPG, PNG, WEBP, GIF, SVG." },
          { status: 400 }
        );
      }

      const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_PHOTO_SIZE) {
        return NextResponse.json(
          { error: "Image size exceeds 5MB limit." },
          { status: 400 }
        );
      }

      folder = "portfolio/profile";
      resourceType = "image";
    } else if (type === "resume") {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        return NextResponse.json(
          { error: "Invalid file format. Resume must be a PDF document." },
          { status: 400 }
        );
      }

      const MAX_RESUME_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_RESUME_SIZE) {
        return NextResponse.json(
          { error: "Resume file size exceeds 10MB limit." },
          { status: 400 }
        );
      }

      folder = "portfolio/resume";
      resourceType = "raw";
      // Cloudinary raw uploads need .pdf extension in public_id so the download URL retains the PDF extension
      const sanitizedBaseName = file.name
        .replace(/\.pdf$/i, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_");
      publicId = `${sanitizedBaseName}_${Date.now()}.pdf`;
    } else {
      return NextResponse.json(
        { error: `Unsupported upload type '${type}'. Expected 'photo' or 'resume'.` },
        { status: 400 }
      );
    }

    // 5. Convert file to buffer and stream to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadOptions: Record<string, any> = {
      folder,
      resource_type: resourceType,
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cld.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error || !result) {
              reject(error || new Error("Failed to receive Cloudinary response."));
            } else {
              resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
              });
            }
          }
        );
        uploadStream.end(buffer);
      }
    );

    return NextResponse.json(
      {
        success: true,
        secure_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        filename: file.name,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred during file upload." },
      { status: 500 }
    );
  }
}
