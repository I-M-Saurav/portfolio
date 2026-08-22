import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

// 1. Manually parse .env.local if not already in process.env
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Error: Missing Firebase Admin environment variables in .env.local");
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = admin.firestore();

async function seed() {
  console.log("🚀 Starting Firestore Database Seeding for Portfolio...");

  // 1. Seed Profile (`profile/main`)
  console.log("📝 Seeding Profile document (profile/main)...");
  await db.doc("profile/main").set({
    name: "Alex Developer",
    tagline: "Full-Stack Engineer & Distributed Systems Specialist",
    location: "San Francisco, CA / Remote",
    bio: "Specializing in TypeScript, high-performance web frontends, distributed backends, and cloud architectures. Passionate about developer tooling, clean interface design, and resilient backend services.",
    email: "alex.developer@example.com",
    degree: "B.S. in Computer Science",
    year: "Class of 2025",
    focus: "Distributed Systems & Web Performance",
    githubUsername: "torvalds",
    codeforcesHandle: "tourist",
    resumeUrl: "https://example.com/resume.pdf",
    quickFacts: [
      { key: "degree", value: "B.S. in Computer Science" },
      { key: "year", value: "Class of 2025" },
      { key: "focus", value: "Distributed Systems & Modern Web" },
      { key: "interests", value: "Cloud Infrastructure, Compilers, UI Engineering" },
    ],
    updatedAt: new Date().toISOString(),
  });

  // 2. Seed 2 Realistic Experience items
  console.log("💼 Seeding Experience items...");
  const experiences = [
    {
      company: "CloudScale Systems",
      role: "Software Engineering Intern",
      duration: "Jun 2025 - Aug 2025",
      location: "Seattle, WA (Hybrid)",
      description: [
        "Engineered real-time telemetry processing pipelines using Go and gRPC, reducing ingestion latency by 35%.",
        "Automated multi-region container deployments on AWS EKS with Terraform and GitHub Actions.",
        "Optimized high-traffic PostgreSQL query indexes handling 10M+ daily telemetry events.",
      ],
      techStack: ["Go", "gRPC", "PostgreSQL", "Docker", "Kubernetes", "AWS"],
      order: 1,
      createdAt: new Date().toISOString(),
    },
    {
      company: "DevSprint Labs",
      role: "Full-Stack Developer Intern",
      duration: "Jan 2025 - May 2025",
      location: "Remote",
      description: [
        "Architected responsive customer portal with Next.js 14 App Router, TypeScript, and Tailwind CSS.",
        "Integrated Firebase Authentication with session management and Firestore real-time queries.",
        "Created an automated testing pipeline achieving 92% coverage across critical user flows.",
      ],
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase", "Node.js", "Jest"],
      order: 2,
      createdAt: new Date().toISOString(),
    },
  ];

  for (const exp of experiences) {
    await db.collection("experience").add(exp);
  }

  // 3. Seed Career Log items
  console.log("📜 Seeding Career Log timeline entries...");
  const careerLogs = [
    {
      date: "Aug 2026",
      type: "work",
      title: "Software Engineering Intern @ CloudScale Systems",
      description: "Delivered distributed streaming pipelines and automated deployment workflows.",
      order: 1,
      createdAt: new Date().toISOString(),
    },
    {
      date: "Jan 2026",
      type: "achievement",
      title: "Winner @ Global Open Source Hackathon",
      description: "Built an AI-assisted terminal developer copilot with 1.2k+ GitHub stars.",
      order: 2,
      createdAt: new Date().toISOString(),
    },
    {
      date: "Aug 2025",
      type: "milestone",
      title: "Lead Frontend Architect @ TechClub University",
      description: "Spearheaded portal revamp serving 15,000+ active students.",
      order: 3,
      createdAt: new Date().toISOString(),
    },
    {
      date: "Sep 2023",
      type: "education",
      title: "Enrolled in B.S. Computer Science",
      description: "Specialization in Systems and Algorithms. Dean's Honors List.",
      order: 4,
      createdAt: new Date().toISOString(),
    },
  ];

  for (const log of careerLogs) {
    await db.collection("careerLog").add(log);
  }

  // 4. Seed Skills
  console.log("⚡ Seeding Categorized Skills...");
  const skills = [
    { name: "TypeScript", category: "Languages", proficiency: 92, order: 1 },
    { name: "JavaScript", category: "Languages", proficiency: 95, order: 2 },
    { name: "Python", category: "Languages", proficiency: 85, order: 3 },
    { name: "Go (Golang)", category: "Languages", proficiency: 75, order: 4 },
    { name: "SQL", category: "Languages", proficiency: 88, order: 5 },

    { name: "React / Next.js", category: "Frontend", proficiency: 95, order: 1 },
    { name: "Tailwind CSS", category: "Frontend", proficiency: 95, order: 2 },
    { name: "Framer Motion", category: "Frontend", proficiency: 85, order: 3 },

    { name: "Node.js", category: "Backend", proficiency: 90, order: 1 },
    { name: "Express / NestJS", category: "Backend", proficiency: 82, order: 2 },
    { name: "gRPC & REST", category: "Backend", proficiency: 88, order: 3 },

    { name: "PostgreSQL", category: "Databases", proficiency: 90, order: 1 },
    { name: "Firestore / Firebase", category: "Databases", proficiency: 88, order: 2 },
    { name: "Redis", category: "Databases", proficiency: 80, order: 3 },

    { name: "Docker", category: "DevOps", proficiency: 85, order: 1 },
    { name: "CI/CD & GitHub Actions", category: "DevOps", proficiency: 88, order: 2 },
    { name: "AWS (S3, Lambda, EC2)", category: "Cloud", proficiency: 80, order: 1 },
    { name: "Git", category: "Tools", proficiency: 95, order: 1 },
    { name: "Linux / Bash", category: "Tools", proficiency: 85, order: 2 },
  ];

  for (const skill of skills) {
    await db.collection("skills").add(skill);
  }

  // 5. Seed Projects
  console.log("🚀 Seeding Projects Catalog...");
  const projects = [
    {
      title: "HyperFlow Distributed Stream Engine",
      description:
        "High-throughput real-time event streaming and analytical pipeline engineered with Go, Apache Kafka, and Redis. Features sub-millisecond pub-sub routing, partition rebalancing, dynamic dead-letter queues, and real-time observability telemetry.",
      techStack: ["Go", "Kafka", "Redis", "Docker", "gRPC", "Prometheus"],
      githubUrl: "https://github.com/I-M-Saurav/delivery-eta-project",
      liveUrl: "https://hyperflow-demo.vercel.app",
      featured: true,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "OmniSync Real-Time Collaborative Canvas",
      description:
        "Multiplayer collaborative whiteboard and node-graph canvas built on top of WebSockets, CRDTs (Conflict-free Replicated Data Types), and WebGL rendering. Supports 50+ concurrent users with zero visual desynchronization.",
      techStack: ["TypeScript", "Next.js 14", "WebSockets", "Canvas API", "Tailwind CSS", "Node.js"],
      githubUrl: "https://github.com/I-M-Saurav/p2p-webshare",
      liveUrl: "https://omnisync-canvas.vercel.app",
      featured: true,
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "TerminAI Developer CLI Copilot",
      description:
        "Terminal-native intelligent developer assistant integrating local LLM inference with automated shell command synthesis, git conflict resolution, and AST-aware refactoring pipelines.",
      techStack: ["Rust", "TypeScript", "LLM APIs", "Tree-sitter", "Bash"],
      githubUrl: "https://github.com/I-M-Saurav/CSES-Solutions",
      liveUrl: "",
      featured: false,
      order: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  for (const proj of projects) {
    await db.collection("projects").add(proj);
  }

  console.log("✅ Firestore database seeding completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
