import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

// Email validation regex (standard RFC 5322 compatible regex)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, hp_field, form_timestamp } = body;

    // 1. Spam & Bot Prevention: Honeypot field check
    // If a bot fills out the hidden field, return synthetic success without sending an email
    if (hp_field && typeof hp_field === "string" && hp_field.trim().length > 0) {
      console.warn("Contact form bot submission detected via honeypot field.");
      return NextResponse.json(
        { success: true, message: "Message sent — I'll get back to you soon" },
        { status: 200 }
      );
    }

    // 2. Spam & Bot Prevention: Time-based check (minimum 1.5 seconds to fill out the form)
    if (form_timestamp && typeof form_timestamp === "number") {
      const now = Date.now();
      const elapsedSeconds = (now - form_timestamp) / 1000;
      if (elapsedSeconds < 1.5) {
        console.warn(`Contact form submitted suspiciously fast (${elapsedSeconds.toFixed(2)}s).`);
        return NextResponse.json(
          { success: true, message: "Message sent — I'll get back to you soon" },
          { status: 200 }
        );
      }
    }

    // 3. Server-side Validation
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const trimmedSubject = typeof subject === "string" ? subject.trim() : "";
    const trimmedMessage = typeof message === "string" ? message.trim() : "";

    if (!trimmedName || trimmedName.length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters long." },
        { status: 400 }
      );
    }
    if (trimmedName.length > 100) {
      return NextResponse.json(
        { error: "Name cannot exceed 100 characters." },
        { status: 400 }
      );
    }

    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }
    if (trimmedEmail.length > 255) {
      return NextResponse.json(
        { error: "Email cannot exceed 255 characters." },
        { status: 400 }
      );
    }

    if (!trimmedSubject || trimmedSubject.length < 2) {
      return NextResponse.json(
        { error: "Subject must be at least 2 characters long." },
        { status: 400 }
      );
    }
    if (trimmedSubject.length > 200) {
      return NextResponse.json(
        { error: "Subject cannot exceed 200 characters." },
        { status: 400 }
      );
    }

    if (!trimmedMessage || trimmedMessage.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters long." },
        { status: 400 }
      );
    }
    if (trimmedMessage.length > 5000) {
      return NextResponse.json(
        { error: "Message cannot exceed 5000 characters." },
        { status: 400 }
      );
    }

    // 4. Validate API Key
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Missing RESEND_API_KEY environment variable.");
      return NextResponse.json(
        {
          error:
            "Email service is not configured. Please ensure RESEND_API_KEY is set in environment variables.",
        },
        { status: 500 }
      );
    }

    // 5. Send Email via Resend
    const resend = new Resend(apiKey);
    const recipientEmail = "sauravkumar1507@gmail.com";
    const formattedTimestamp = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: "UTC",
    });

    const safeMessageHtml = trimmedMessage
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/\n/g, "<br />");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Portfolio Contact: ${trimmedSubject}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0d12; color: #e4e4e7; margin: 0; padding: 24px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #12131a; border-radius: 12px; border: 1px solid #27272a; overflow: hidden;">
            <!-- Terminal Header -->
            <tr>
              <td style="padding: 16px 20px; background-color: #18181b; border-bottom: 1px solid #27272a;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #ef4444; margin-right: 6px;"></span>
                      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #eab308; margin-right: 6px;"></span>
                      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #10b981; margin-right: 12px;"></span>
                      <span style="font-family: monospace; font-size: 12px; color: #a1a1aa;">incoming_message.sh</span>
                    </td>
                    <td align="right">
                      <span style="font-family: monospace; font-size: 11px; color: #10b981; font-weight: bold;">[NEW DISPATCH]</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 28px 24px;">
                <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #ffffff; font-family: monospace;">
                  [ Portfolio Contact Submission ]
                </h2>

                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; font-size: 13px; font-family: monospace;">
                  <tr>
                    <td style="padding: 6px 0; color: #10b981; width: 100px; font-weight: bold;">SENDER:</td>
                    <td style="padding: 6px 0; color: #f4f4f5; font-weight: bold;">${trimmedName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #10b981; width: 100px; font-weight: bold;">EMAIL:</td>
                    <td style="padding: 6px 0; color: #38bdf8;">
                      <a href="mailto:${trimmedEmail}" style="color: #38bdf8; text-decoration: none;">${trimmedEmail}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #10b981; width: 100px; font-weight: bold;">SUBJECT:</td>
                    <td style="padding: 6px 0; color: #f4f4f5;">${trimmedSubject}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #71717a; width: 100px;">TIMESTAMP:</td>
                    <td style="padding: 6px 0; color: #a1a1aa;">${formattedTimestamp}</td>
                  </tr>
                </table>

                <div style="background-color: #1c1d24; border: 1px solid #27272a; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                  <div style="font-family: monospace; font-size: 11px; color: #a1a1aa; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
                    MESSAGE_PAYLOAD:
                  </div>
                  <div style="font-size: 14px; line-height: 1.6; color: #e4e4e7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    ${safeMessageHtml}
                  </div>
                </div>

                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center">
                      <a href="mailto:${trimmedEmail}?subject=Re: ${encodeURIComponent(trimmedSubject)}" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: #ffffff; text-decoration: none; border-radius: 8px; font-family: monospace; font-size: 13px; font-weight: bold;">
                        Reply Directly to ${trimmedName} &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 16px 24px; background-color: #0e0f14; border-top: 1px solid #27272a; text-align: center; font-size: 11px; color: #71717a; font-family: monospace;">
                Sent via Saurav's Portfolio Contact Gateway &bull; Resend Engine
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const emailText = `
[ PORTFOLIO CONTACT SUBMISSION ]

SENDER: ${trimmedName}
EMAIL: ${trimmedEmail}
SUBJECT: ${trimmedSubject}
TIMESTAMP: ${formattedTimestamp}

MESSAGE PAYLOAD:
----------------------------------------
${trimmedMessage}
----------------------------------------

Reply to: ${trimmedEmail}
    `.trim();

    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [recipientEmail],
      replyTo: trimmedEmail,
      subject: `[Portfolio Contact] ${trimmedSubject}`,
      text: emailText,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API send error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to deliver message via email provider." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message sent — I'll get back to you soon",
        id: data?.id,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Contact API internal error:", err);
    return NextResponse.json(
      { error: err?.message || "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
