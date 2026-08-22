import { ImageResponse } from "next/og";
import { siteContent } from "@/lib/content";

export const runtime = "edge";
export const alt = "Portfolio Preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface OgProfile {
  name: string;
  tagline: string;
  location?: string;
  bio?: string;
  degree?: string;
  githubUsername?: string;
}

async function getOgProfile(): Promise<OgProfile> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "saurav-portfolio-edba0";
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/profile/main`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const data = await res.json();
      const fields = data.fields || {};
      return {
        name: fields.name?.stringValue || siteContent.name,
        tagline: fields.tagline?.stringValue || siteContent.identity,
        location: fields.location?.stringValue || "Roorkee, India / Remote",
        bio: fields.bio?.stringValue || siteContent.bio,
        degree: fields.degree?.stringValue || "B.Tech in Electronics and Communication Engineering",
        githubUsername: fields.githubUsername?.stringValue || "I-M-Saurav",
      };
    }
  } catch (err) {
    console.warn("OG image Firestore fetch fallback:", err);
  }

  return {
    name: siteContent.name,
    tagline: siteContent.identity,
    location: "Roorkee, India / Remote",
    bio: siteContent.bio,
    degree: "B.Tech in Electronics and Communication Engineering",
    githubUsername: "I-M-Saurav",
  };
}

export default async function Image() {
  const profile = await getOgProfile();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0e",
          backgroundImage: "radial-gradient(circle at 50% 0%, #064e3b 0%, #0a0a0e 70%)",
          padding: "40px",
          fontFamily: "monospace",
        }}
      >
        {/* Terminal Window Container */}
        <div
          style={{
            width: "1120px",
            height: "550px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(17, 17, 22, 0.95)",
            borderRadius: "20px",
            border: "2px solid rgba(16, 185, 129, 0.3)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
            overflow: "hidden",
          }}
        >
          {/* Top Window Bar */}
          <div
            style={{
              height: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              backgroundColor: "rgba(24, 24, 32, 0.9)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#ff5f56" }} />
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#27c93f" }} />
              <span style={{ color: "#9ca3af", marginLeft: "16px", fontSize: "18px" }}>
                ~/portfolio/profile.sh
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#10b981",
                fontSize: "16px",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                padding: "6px 14px",
                borderRadius: "8px",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }} />
              <span>ONLINE</span>
            </div>
          </div>

          {/* Terminal Body */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "36px 44px",
            }}
          >
            {/* Command line prompt */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#10b981", fontSize: "20px" }}>
                <span>&gt;</span>
                <span style={{ color: "#f3f4f6" }}>whoami --portfolio</span>
              </div>

              {/* Main Title & Subtitle */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                <div style={{ fontSize: "52px", fontWeight: "bold", color: "#ffffff", letterSpacing: "-1px" }}>
                  {profile.name}
                </div>
                <div style={{ fontSize: "26px", color: "#34d399", fontWeight: 600 }}>
                  {profile.tagline}
                </div>
              </div>

              {/* Bio summary */}
              <div
                style={{
                  fontSize: "18px",
                  color: "#9ca3af",
                  lineHeight: 1.5,
                  maxWidth: "960px",
                  marginTop: "6px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {profile.bio || "Software Engineer specializing in Distributed Systems, High-Performance Web Applications, and Scalable Backend Architectures."}
              </div>
            </div>

            {/* Bottom Metadata Badges */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                paddingTop: "20px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              {profile.degree && (
                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: "#d1d5db",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "15px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  🎓 {profile.degree}
                </div>
              )}
              {profile.location && (
                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: "#d1d5db",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "15px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  📍 {profile.location}
                </div>
              )}
              {profile.githubUsername && (
                <div
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    color: "#10b981",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "15px",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}
                >
                  github.com/{profile.githubUsername}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
