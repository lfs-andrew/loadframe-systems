import sgMail from "@sendgrid/mail";

type LeadLike = Record<string, any>;

function env(name: string) {
  return (process.env[name] || "").trim();
}

function formatLead(lead: LeadLike) {
  const safe = (v: any) =>
    v === undefined || v === null || v === "" ? "-" : String(v);

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
    `Monetization Flags: ${
      Array.isArray(lead.monetizationFlags)
        ? lead.monetizationFlags.join(", ")
        : safe(lead.monetizationFlags)
    }`,
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
  const SENDGRID_API_KEY = env("SENDGRID_API_KEY");
  const EMAIL_FROM = env("EMAIL_FROM");
  const NOTIFY_TO = env("NOTIFY_TO");

  if (!SENDGRID_API_KEY || !EMAIL_FROM || !NOTIFY_TO) {
    console.error("[email] Missing env at send time:", {
      hasKey: !!SENDGRID_API_KEY,
      from: EMAIL_FROM,
      to: NOTIFY_TO,
    });
    return { ok: false };
  }

  sgMail.setApiKey(SENDGRID_API_KEY);

  try {
    await sgMail.send({
      to: NOTIFY_TO,
      from: EMAIL_FROM,
      subject: `New LoadFrame Application — ${lead?.name || "Unknown"}`,
      text: formatLead(lead),
    });

    console.log("[email] Sent successfully");
    return { ok: true };
  } catch (err: any) {
    console.error("[email] SendGrid error:", err?.response?.body || err);
    return { ok: false };
  }
}
