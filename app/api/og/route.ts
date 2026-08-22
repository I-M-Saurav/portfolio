import { NextRequest, NextResponse } from "next/server";
import { siteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const name = siteContent.name;
  const tagline = siteContent.identity;
  const bio = siteContent.bio;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="0%" r="75%">
        <stop offset="0%" stop-color="#064e3b" />
        <stop offset="80%" stop-color="#0a0a0e" />
      </radialGradient>
      <linearGradient id="termBorder" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#047857" stop-opacity="0.1" />
      </linearGradient>
    </defs>

    <!-- Outer background -->
    <rect width="1200" height="630" fill="url(#bgGlow)" />

    <!-- Terminal Window Container -->
    <g transform="translate(40, 40)">
      <rect width="1120" height="550" rx="16" fill="#111116" fill-opacity="0.95" stroke="url(#termBorder)" stroke-width="2" filter="drop-shadow(0 20px 30px rgba(0,0,0,0.8))" />

      <!-- Top Window Bar -->
      <rect width="1120" height="54" rx="16" fill="#181820" fill-opacity="0.9" />
      <rect y="38" width="1120" height="16" fill="#181820" fill-opacity="0.9" />
      <line x1="0" y1="54" x2="1120" y2="54" stroke="rgba(255,255,255,0.1)" stroke-width="1" />

      <!-- Window control buttons -->
      <circle cx="28" cy="27" r="7" fill="#ff5f56" />
      <circle cx="48" cy="27" r="7" fill="#ffbd2e" />
      <circle cx="68" cy="27" r="7" fill="#27c93f" />

      <text x="96" y="32" fill="#9ca3af" font-family="monospace" font-size="14">~/portfolio/profile.sh</text>

      <!-- Status badge -->
      <g transform="translate(1000, 14)">
        <rect width="96" height="26" rx="6" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-opacity="0.3" stroke-width="1" />
        <circle cx="16" cy="13" r="4" fill="#10b981" />
        <text x="28" y="17" fill="#10b981" font-family="monospace" font-size="12" font-weight="bold">ONLINE</text>
      </g>

      <!-- Terminal Body -->
      <g transform="translate(44, 100)">
        <!-- Command Prompt -->
        <text x="0" y="0" fill="#10b981" font-family="monospace" font-size="20" font-weight="bold">&gt; <tspan fill="#f3f4f6">whoami --portfolio</tspan></text>

        <!-- Name & Tagline -->
        <text x="0" y="64" fill="#ffffff" font-family="monospace" font-size="46" font-weight="bold">${name}</text>
        <text x="0" y="104" fill="#34d399" font-family="monospace" font-size="22" font-weight="600">${tagline}</text>

        <!-- Bio Paragraph -->
        <foreignObject x="0" y="130" width="1020" height="120">
          <p xmlns="http://www.w3.org/1999/xhtml" style="font-family: monospace; font-size: 17px; color: #9ca3af; line-height: 1.6; margin: 0;">
            ${bio}
          </p>
        </foreignObject>

        <!-- Key Pills -->
        <g transform="translate(0, 310)">
          <!-- Degree pill -->
          <rect width="480" height="38" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
          <text x="16" y="24" fill="#d1d5db" font-family="monospace" font-size="14">🎓 B.Tech in Electronics &amp; Communication</text>

          <!-- Institution pill -->
          <g transform="translate(500, 0)">
            <rect width="250" height="38" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
            <text x="16" y="24" fill="#d1d5db" font-family="monospace" font-size="14">🏛️ IIT Roorkee</text>
          </g>

          <!-- GitHub pill -->
          <g transform="translate(770, 0)">
            <rect width="250" height="38" rx="8" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" stroke-width="1" />
            <text x="16" y="24" fill="#10b981" font-family="monospace" font-size="14">github.com/I-M-Saurav</text>
          </g>
        </g>
      </g>
    </g>
  </svg>`;

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
