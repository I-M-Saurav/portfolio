import { Timestamp } from "firebase/firestore";

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
