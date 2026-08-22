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

  const title = `${profile.name} | Software Engineer`;
  const description = profile.bio || "Personal portfolio and technical showcase of Saurav Kumar — Software Engineer.";

  return {
    title,
    description,
    keywords: [
      profile.name,
      "Software Engineer",
      "Full-Stack Developer",
      "Distributed Systems",
      "TypeScript",
      "Next.js",
      "Competitive Programming",
      "Portfolio",
    ],
    authors: [{ name: profile.name, url: `https://github.com/${profile.githubUsername || "I-M-Saurav"}` }],
    creator: profile.name,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
      siteName: `${profile.name} Portfolio`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: profile.twitterUrl ? `@${profile.twitterUrl.split("/").pop()}` : undefined,
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
