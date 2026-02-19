import nodemailer from "nodemailer";

type LeadLike = Record<string, any>;

function env(name: string) {
  return (process.env[name] || "").trim();
}

const SMTP_HOST = env("SMTP_HOST");
const SMTP_PORT = Number(env("SMTP_PORT") || "587");
const SMTP_USER = env("SMTP_USER");
const SMTP_PASS = env("SMTP_PASS");

export const EMAIL_FROM = env("EMAIL_FROM") || SMTP_USER;
export const NOTIFY_TO = env("NOTIFY_TO");

function isEmailConfigured() {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && EMAIL_FROM && NOTIFY_TO);
}

function getTransport() {
  // Lazy-create transporter only when needed
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

function formatLead(lead: LeadLike) {
  // Keep it simple + readable
  const safe = (v: any) => (v === undefined || v === null || v === "" ? "-" : String(v));

  return [
    `New Lead Submission`,
    ``,
    `Name: ${safe(lead.name)}`,
    `Email: ${safe(lead.email)}`,
    `Link: ${safe(lead.link)}`,
    `Platform: ${safe(lead.primaryPlatform)}`,
    `Audience Size: ${safe(lead.followerRange)}`,
    `Monthly Revenue: ${safe(lead.monthlyRevenueRange)}`,
    `Stuck Duration: ${safe(lead.stuckDuration)}`,
    ``,
    `Revenue Mix (%): ${JSON.stringify(lead.revenueMix ?? {}, null, 2)}`,
    `Monetization Flags: ${Array.isArray(lead.monetizationFlags) ? lead.monetizationFlags.join(", ") : safe(lead.monetizationFlags)}`,
    ``,
    `Biggest Worry:`,
    `${safe(lead.biggestWorry)}`,
    ``,
    `Open To Call: ${safe(lead.openToCall)}`,
    `Consent: ${safe(lead.consent)}`,
    ``,
    `Submitted At: ${new Date().toISOString()}`,
  ].join("\n");
}

export async function sendLeadNotification(lead: LeadLike) {
  if (!isEmailConfigured()) {
    // Do NOT crash dev/prod; just skip until configured.
    console.warn(
      `[email] Skipping email notification (SMTP not configured). Missing one of: SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_FROM, NOTIFY_TO`
    );
    return { ok: false, skipped: true };
  }

  const transporter = getTransport();
  const text = formatLead(lead);

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: NOTIFY_TO,
    subject: `New LoadFrame Application — ${lead?.name || "Unknown"}`,
    text,
  });

  return { ok: true };
}
