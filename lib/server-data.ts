import { getAdminDb } from "@/lib/firebase/admin";
import {
  ProfileDocument,
  CareerLogDocument,
  ExperienceDocument,
  SkillDocument,
} from "@/types/firestore";
import { siteContent } from "@/lib/content";

const FALLBACK_PROFILE: ProfileDocument = {
  name: siteContent.name,
  tagline: siteContent.identity,
  location: "San Francisco, CA / Remote",
  bio: siteContent.bio,
  email: "saurav_k@ece.iitr.ac.in",
  degree: "B.S. in Computer Science",
  year: "Class of 2025",
  focus: "Distributed Systems & Web Performance",
  resumeUrl: "#",
  quickFacts: [
    { key: "degree", value: "B.S. in Computer Science" },
    { key: "year", value: "Class of 2025" },
    { key: "focus", value: "Distributed Systems & Modern Web" },
    { key: "interests", value: "Cloud Infrastructure, Compilers, UI Engineering" },
  ],
};

export async function getProfileServer(): Promise<ProfileDocument> {
  try {
    const db = getAdminDb();
    const snap = await db.doc("profile/main").get();
    if (snap.exists) {
      const data = snap.data() as any;
      return {
        name: data.name || FALLBACK_PROFILE.name,
        tagline: data.tagline || FALLBACK_PROFILE.tagline,
        location: data.location || FALLBACK_PROFILE.location,
        bio: data.bio || FALLBACK_PROFILE.bio,
        email: data.email || FALLBACK_PROFILE.email,
        degree: data.degree || FALLBACK_PROFILE.degree,
        year: data.year || FALLBACK_PROFILE.year,
        focus: data.focus || FALLBACK_PROFILE.focus,
        resumeUrl: data.resumeUrl || FALLBACK_PROFILE.resumeUrl,
        photoUrl: data.photoUrl || "",
        githubUsername: data.githubUsername || "",
        codeforcesHandle: data.codeforcesHandle || "",
        quickFacts: Array.isArray(data.quickFacts) ? data.quickFacts : FALLBACK_PROFILE.quickFacts,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || "",
      };
    }
  } catch (error) {
    console.warn("getProfileServer error, using fallback:", error);
  }
  return FALLBACK_PROFILE;
}

export async function getCareerLogsServer(): Promise<CareerLogDocument[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("careerLog").orderBy("order", "asc").get();
    if (!snap.empty) {
      return snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          date: data.date || "",
          type: data.type || "work",
          title: data.title || "",
          description: data.description || "",
          order: typeof data.order === "number" ? data.order : 0,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || "",
        };
      });
    }
  } catch (error) {
    console.warn("getCareerLogsServer error, using fallback:", error);
  }
  return [];
}

export async function getExperiencesServer(): Promise<ExperienceDocument[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("experience").orderBy("order", "asc").get();
    if (!snap.empty) {
      return snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          company: data.company || "",
          role: data.role || "",
          duration: data.duration || "",
          location: data.location || "",
          description: Array.isArray(data.description) ? data.description : [],
          techStack: Array.isArray(data.techStack) ? data.techStack : [],
          order: typeof data.order === "number" ? data.order : 0,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || "",
        };
      });
    }
  } catch (error) {
    console.warn("getExperiencesServer error, using fallback:", error);
  }
  return [];
}

export async function getSkillsServer(): Promise<SkillDocument[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("skills").orderBy("order", "asc").get();
    if (!snap.empty) {
      return snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          category: data.category || "Languages",
          proficiency: typeof data.proficiency === "number" ? data.proficiency : 0,
          order: typeof data.order === "number" ? data.order : 0,
        };
      });
    }
  } catch (error) {
    console.warn("getSkillsServer error, using fallback:", error);
  }
  return [];
}
