import { Timestamp } from "firebase/firestore";

export interface QuickFact {
  key: string;
  value: string;
}

export interface ProfileDocument {
  id?: string;
  name: string;
  tagline: string;
  location: string;
  bio: string;
  photoUrl?: string;
  resumeUrl?: string;
  email: string;
  degree?: string;
  year?: string;
  focus?: string;
  quickFacts: QuickFact[];
  updatedAt?: Timestamp | Date | string;
}

export type CareerLogType = "education" | "work" | "achievement" | "milestone";

export interface CareerLogDocument {
  id?: string;
  date: string; // e.g. "Aug 2026"
  type: CareerLogType;
  title: string;
  description: string;
  order: number;
  createdAt?: Timestamp | Date | string;
}

export interface ExperienceDocument {
  id?: string;
  company: string;
  role: string;
  duration: string; // e.g. "Jun 2025 - Aug 2025"
  location: string;
  description: string[]; // Bullet points
  techStack: string[];
  order: number;
  createdAt?: Timestamp | Date | string;
}

export type SkillCategory =
  | "Languages"
  | "Frontend"
  | "Backend"
  | "Databases"
  | "DevOps"
  | "Cloud"
  | "Tools";

export interface SkillDocument {
  id?: string;
  name: string;
  category: SkillCategory;
  proficiency?: number; // 0-100
  order: number;
}

export interface ProjectDocument {
  id?: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  order: number;
  createdAt: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;
}
