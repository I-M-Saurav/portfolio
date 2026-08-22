import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { getProfileServer } from "@/lib/server-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfileServer();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio-imsaurav.vercel.app";
  const title = `${profile.name} — ${profile.tagline || "Software Engineer"}`;
  const description =
    profile.bio ||
    `Personal portfolio and engineering showcase of ${profile.name} — Software Engineer specializing in Distributed Systems, Modern Web, and Performance.`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${profile.name}`,
    },
    description,
    keywords: [
      profile.name,
      "Software Engineer",
      "SDE",
      "Full-Stack Developer",
      "Distributed Systems",
      "TypeScript",
      "Next.js",
      "React",
      "Competitive Programming",
      "Portfolio",
      profile.degree || "Computer Science",
      profile.location || "Remote",
    ],
    authors: [
      {
        name: profile.name,
        url: `https://github.com/${profile.githubUsername || "I-M-Saurav"}`,
      },
    ],
    creator: profile.name,
    publisher: profile.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: "/",
      locale: "en_US",
      siteName: `${profile.name} Portfolio`,
      images: [
        {
          url: "/api/og",
          width: 1200,
          height: 630,
          alt: `${profile.name} — Portfolio Preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/api/og"],
      creator: profile.twitterUrl ? `@${profile.twitterUrl.split("/").pop()}` : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [
        { url: "/apple-icon.svg", type: "image/svg+xml" },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
