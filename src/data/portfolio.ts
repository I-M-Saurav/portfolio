// ============================================================
// PORTFOLIO DATA — Edit this file to update your portfolio
// ============================================================

export const personalInfo = {
  name: "Saurav Kumar",
  tagline: "Software Engineer · Problem Solver · Builder",
  bio: `I'm a passionate software engineer who loves building elegant solutions to complex problems.
From competitive programming to production systems, I thrive at the intersection of
performance and clean design. Currently exploring distributed systems and open-source.`,
  location: "India",
  email: "saurav@example.com",
  resumeUrl: "#",
  avatar: "", // optional: URL to photo
};

export const socialLinks = {
  github: "https://github.com/sauravkumar",
  linkedin: "https://linkedin.com/in/sauravkumar",
  codeforces: "https://codeforces.com/profile/sauravkumar",
  leetcode: "https://leetcode.com/sauravkumar",
  twitter: "https://twitter.com/sauravkumar",
};

export const codingProfiles = [
  {
    id: "github",
    platform: "GitHub",
    username: "sauravkumar",
    url: "https://github.com/sauravkumar",
    stats: "Active contributor",
    color: "#6e40c9",
    icon: "github",
  },
  {
    id: "codeforces",
    platform: "Codeforces",
    username: "sauravkumar",
    url: "https://codeforces.com/profile/sauravkumar",
    stats: "Rating: 1600+",
    color: "#1a8cff",
    icon: "code",
  },
  {
    id: "leetcode",
    platform: "LeetCode",
    username: "sauravkumar",
    url: "https://leetcode.com/sauravkumar",
    stats: "500+ problems solved",
    color: "#ffa116",
    icon: "terminal",
  },
];

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number; // 0-100
  icon?: string;
}

export const skills: Skill[] = [
  // Languages
  { id: "s1", name: "C++", category: "Languages", level: 95 },
  { id: "s2", name: "Python", category: "Languages", level: 88 },
  { id: "s3", name: "TypeScript", category: "Languages", level: 85 },
  { id: "s4", name: "Go", category: "Languages", level: 75 },
  { id: "s5", name: "Java", category: "Languages", level: 80 },
  // Frameworks & Tools
  { id: "s6", name: "React", category: "Frontend", level: 88 },
  { id: "s7", name: "Node.js", category: "Backend", level: 85 },
  { id: "s8", name: "FastAPI", category: "Backend", level: 80 },
  { id: "s9", name: "PostgreSQL", category: "Databases", level: 82 },
  { id: "s10", name: "Redis", category: "Databases", level: 78 },
  { id: "s11", name: "Docker", category: "DevOps", level: 80 },
  { id: "s12", name: "Kubernetes", category: "DevOps", level: 70 },
  { id: "s13", name: "AWS", category: "Cloud", level: 75 },
  { id: "s14", name: "Git", category: "Tools", level: 92 },
  // CS Fundamentals
  { id: "s15", name: "Algorithms", category: "Fundamentals", level: 95 },
  { id: "s16", name: "System Design", category: "Fundamentals", level: 82 },
];

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  image?: string;
}

export const projects: Project[] = [
  {
    id: "p1",
    title: "Distributed Key-Value Store",
    description:
      "A fault-tolerant, high-performance key-value store built from scratch using Raft consensus algorithm. Supports leader election, log replication, and snapshotting.",
    tech: ["Go", "Raft", "gRPC", "Protocol Buffers"],
    githubUrl: "https://github.com/sauravkumar/kvstore",
    featured: true,
  },
  {
    id: "p2",
    title: "Competitive Programming Judge",
    description:
      "An online judge platform supporting 10+ languages with sandboxed execution, real-time verdicts, and contest management for 500+ users.",
    tech: ["Node.js", "React", "Docker", "PostgreSQL", "Redis"],
    githubUrl: "https://github.com/sauravkumar/oj",
    liveUrl: "https://judge.example.com",
    featured: true,
  },
  {
    id: "p3",
    title: "Real-time Collaborative Editor",
    description:
      "A Google Docs–like collaborative editor using Operational Transformation for conflict resolution, WebSockets for real-time sync.",
    tech: ["TypeScript", "React", "WebSockets", "MongoDB"],
    githubUrl: "https://github.com/sauravkumar/collab-editor",
    featured: true,
  },
  {
    id: "p4",
    title: "ML Pipeline Orchestrator",
    description:
      "Automated ML pipeline tool that handles data ingestion, feature engineering, model training, and deployment with a simple YAML config.",
    tech: ["Python", "FastAPI", "Celery", "Docker", "AWS S3"],
    githubUrl: "https://github.com/sauravkumar/ml-pipeline",
    featured: false,
  },
];

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  start: string;
  end: string;
  description: string[];
  tech: string[];
  location: string;
  type: "full-time" | "internship" | "contract";
}

export const experience: Experience[] = [
  {
    id: "e1",
    company: "Tech Corp",
    role: "Software Engineer",
    duration: "Jan 2024 – Present",
    start: "2024-01",
    end: "Present",
    description: [
      "Built and scaled microservices handling 10M+ daily requests",
      "Reduced p99 latency by 40% through query optimization and caching",
      "Led a team of 4 engineers to deliver the new payments platform",
    ],
    tech: ["Go", "Kubernetes", "PostgreSQL", "Redis", "Kafka"],
    location: "Bangalore, India",
    type: "full-time",
  },
  {
    id: "e2",
    company: "StartupX",
    role: "Software Engineer Intern",
    duration: "May 2023 – Aug 2023",
    start: "2023-05",
    end: "2023-08",
    description: [
      "Developed a real-time analytics dashboard for campaign performance",
      "Implemented OAuth 2.0 integration with 5 third-party platforms",
      "Wrote comprehensive unit and integration tests, achieving 85% coverage",
    ],
    tech: ["Node.js", "React", "TypeScript", "MongoDB"],
    location: "Remote",
    type: "internship",
  },
];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: "competitive" | "academic" | "open-source" | "award";
  url?: string;
}

export const achievements: Achievement[] = [
  {
    id: "a1",
    title: "ICPC Asia Regionals",
    description: "Ranked in top 50 teams at ICPC Asia Regional Contest 2023",
    date: "2023",
    category: "competitive",
    url: "#",
  },
  {
    id: "a2",
    title: "Google Kickstart",
    description:
      "Global rank 120 in Google Kickstart Round F 2023 (5000+ participants)",
    date: "2023",
    category: "competitive",
  },
  {
    id: "a3",
    title: "Codeforces Expert",
    description:
      "Achieved Expert rating (1600+) on Codeforces through competitive programming",
    date: "2022",
    category: "competitive",
    url: "https://codeforces.com/profile/sauravkumar",
  },
  {
    id: "a4",
    title: "Open Source Contributor",
    description: "Merged 10+ PRs to major open source projects including VSCode extensions",
    date: "2023",
    category: "open-source",
    url: "https://github.com/sauravkumar",
  },
  {
    id: "a5",
    title: "Institute Gold Medal",
    description:
      "Awarded Gold Medal for academic excellence — top 1% of batch",
    date: "2024",
    category: "academic",
  },
];

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  duration: string;
  gpa?: string;
  location: string;
  activities?: string[];
}

export const education: Education[] = [
  {
    id: "ed1",
    institution: "IIT XYZ",
    degree: "Bachelor of Technology",
    field: "Computer Science and Engineering",
    duration: "2020 – 2024",
    gpa: "9.2 / 10",
    location: "India",
    activities: [
      "Programming Club President",
      "ICPC Team Member",
      "Teaching Assistant – Data Structures",
    ],
  },
];
