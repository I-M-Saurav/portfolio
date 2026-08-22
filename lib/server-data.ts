import { getAdminDb } from "@/lib/firebase/admin";
import {
  ProfileDocument,
  CareerLogDocument,
  ExperienceDocument,
  SkillDocument,
  ProjectDocument,
  EducationDocument,
  PositionDocument,
} from "@/types/firestore";
import { siteContent } from "@/lib/content";

const FALLBACK_PROFILE: ProfileDocument = {
  name: siteContent.name,
  tagline: siteContent.identity,
  location: "Roorkee, India / Remote",
  bio: siteContent.bio,
  email: "saurav_k@ece.iitr.ac.in",
  degree: "B.Tech in Electronics and Communication Engineering",
  year: "Class of 2026",
  focus: "Distributed Systems, Web Performance & Competitive Programming",
  resumeUrl: "#",
  githubUsername: "I-M-Saurav",
  codeforcesHandle: "Knight_master",
  phone: "+91 98765 43210",
  linkedinUrl: "https://linkedin.com/in/saurav-kumar",
  twitterUrl: "https://twitter.com",
  contactMessage: "Open to software engineering roles, distributed systems projects, and high-impact teams. Let's connect!",
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/I-M-Saurav" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/saurav-kumar" },
    { platform: "Codeforces", url: "https://codeforces.com/profile/Knight_master" },
    { platform: "Twitter", url: "https://twitter.com" },
  ],
  quickFacts: [
    { key: "institution", value: "Indian Institute of Technology (IIT) Roorkee" },
    { key: "degree", value: "B.Tech in ECE" },
    { key: "year", value: "Class of 2026" },
    { key: "focus", value: "Distributed Systems & Full-Stack" },
    { key: "interests", value: "Cloud Infrastructure, Competitive Programming, UI Engineering" },
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
        githubUsername: data.githubUsername || FALLBACK_PROFILE.githubUsername,
        codeforcesHandle: data.codeforcesHandle || FALLBACK_PROFILE.codeforcesHandle,
        phone: data.phone || "",
        linkedinUrl: data.linkedinUrl || "",
        twitterUrl: data.twitterUrl || "",
        contactMessage: data.contactMessage || FALLBACK_PROFILE.contactMessage,
        socialLinks: Array.isArray(data.socialLinks) && data.socialLinks.length > 0 ? data.socialLinks : FALLBACK_PROFILE.socialLinks,
        quickFacts: Array.isArray(data.quickFacts) && data.quickFacts.length > 0 ? data.quickFacts : FALLBACK_PROFILE.quickFacts,
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

export async function getProjectsServer(): Promise<ProjectDocument[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("projects").get();
    if (!snap.empty) {
      const projects: ProjectDocument[] = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "",
          description: data.description || "",
          techStack: Array.isArray(data.techStack) ? data.techStack : [],
          githubUrl: data.githubUrl || "",
          liveUrl: data.liveUrl || "",
          featured: !!data.featured,
          order: typeof data.order === "number" ? data.order : 0,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || "",
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || "",
        };
      });

      // Sort featured projects first, then sort by order ascending
      return projects.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (a.order || 0) - (b.order || 0);
      });
    }
  } catch (error) {
    console.warn("getProjectsServer error, using fallback:", error);
  }
  return [];
}

export async function getEducationServer(): Promise<EducationDocument[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("education").orderBy("order", "asc").get();
    if (!snap.empty) {
      return snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          institution: data.institution || "",
          degree: data.degree || "",
          fieldOfStudy: data.fieldOfStudy || "",
          duration: data.duration || "",
          location: data.location || "",
          gpa: data.gpa || "",
          description: data.description || "",
          order: typeof data.order === "number" ? data.order : 0,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || "",
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || "",
        };
      });
    }
  } catch (error) {
    console.warn("getEducationServer error, using fallback:", error);
  }
  return [];
}

export async function getPositionsServer(): Promise<PositionDocument[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("positions").orderBy("order", "asc").get();
    if (!snap.empty) {
      return snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "",
          organization: data.organization || "",
          duration: data.duration || "",
          description: data.description || "",
          order: typeof data.order === "number" ? data.order : 0,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || "",
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || "",
        };
      });
    }
  } catch (error) {
    console.warn("getPositionsServer error, using fallback:", error);
  }
  return [];
}
