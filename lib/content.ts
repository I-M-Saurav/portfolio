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
  navLogo: "main@portfolio",
  terminalPromptUser: "visitor@portfolio:~$",
  name: "Alex Developer",
  identity: "Full-Stack Engineer & Systems Enthusiast building scalable web applications.",
  bio: "Specializing in TypeScript, distributed systems, high-performance web frontends, and cloud architectures. Passionate about developer tooling, clean interface design, and resilient backend services.",
  status: "[ status: active — open to SDE roles ]",
  coreTechnologies: [
    "TypeScript",
    "React / Next.js",
    "Node.js",
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
    { name: "Experience", href: "#experience" },
    { name: "Education", href: "#education" },
    { name: "Projects", href: "#projects" },
    { name: "Positions", href: "#positions" },
    { name: "Profiles", href: "#profiles" },
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
