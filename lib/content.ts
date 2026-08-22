export interface NavLink {
  name: string;
  href: string;
}

export interface SiteContent {
  navLogo: string;
  terminalPromptUser: string;
  name: string;
  identity: string;
  bio: string;
  status: string;
  coreTechnologies: string[];
  navLinks: NavLink[];
  cta: {
    exploreProjects: {
      text: string;
      href: string;
    };
    getInTouch: {
      text: string;
      href: string;
    };
  };
}

export const siteContent: SiteContent = {
  navLogo: "saurav@portfolio",
  terminalPromptUser: "visitor@saurav:~$",
  name: "Saurav Kumar",
  identity: "Full-Stack Engineer & Distributed Systems Specialist building resilient, high-performance web applications.",
  bio: "Specializing in TypeScript, distributed systems, high-performance web frontends, and cloud architectures. Passionate about developer tooling, clean interface design, and competitive programming.",
  status: "[ status: active — open to SDE roles ]",
  coreTechnologies: [
    "TypeScript",
    "React / Next.js",
    "Node.js",
    "Go (Golang)",
    "PostgreSQL",
    "Firebase",
    "Tailwind CSS",
    "Docker",
    "GraphQL",
    "REST APIs",
    "Git & CI/CD",
  ],
  navLinks: [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Education", href: "#education" },
    { name: "Projects", href: "#projects" },
    { name: "Positions", href: "#positions" },
    { name: "Activity", href: "#activity" },
    { name: "Contact", href: "#contact" },
  ],
  cta: {
    exploreProjects: {
      text: "Explore Projects",
      href: "#projects",
    },
    getInTouch: {
      text: "Get In Touch",
      href: "#contact",
    },
  },
};
