const express = require("express");
const crypto = require("crypto");
const db = require("../config/db_connect");
const nodemailer = require("nodemailer");

const router = express.Router();

// Config (can be overridden by env)
const EMAILJS_SERVICE = process.env.EMAILJS_SERVICE_ID || "service_ftwg9v7";
const EMAILJS_TEMPLATE = process.env.EMAILJS_TEMPLATE_ID || "template_5rzjgj7";
const EMAILJS_USER = process.env.EMAILJS_USER_ID || "-NWp731-hJ2KBhmcB";

// Admin recipients: support comma-separated list via env, fallback to two emails
const rawAdminEmails =
  process.env.VITE_ADMIN_EMAILS ||
  process.env.ADMIN_EMAILS ||
  process.env.VITE_ADMIN_EMAIL ||
  process.env.ADMIN_EMAIL ||
  "";
const adminEmails = rawAdminEmails
  ? rawAdminEmails
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : ["arthalimi989@gmail.com", "suelaleka099@gmail.com"];
const primaryAdminEmail = adminEmails[0];

// Helper to send email: try EmailJS REST first, then SMTP via nodemailer fallback
async function send2FAEmail(toEmail, code) {
  // If SMTP credentials are not configured, and we're in development, log the code for testing
  const DEV_SMTP_HOST = process.env.SMTP_HOST;
  const DEV_SMTP_USER = process.env.SMTP_USER;
  const DEV_SMTP_PASS = process.env.SMTP_PASS;
  if (
    (!DEV_SMTP_HOST || !DEV_SMTP_USER || !DEV_SMTP_PASS) &&
    process.env.NODE_ENV !== "production"
  ) {
    console.log(`DEV 2FA CODE for ${toEmail}: ${code}`);
    return true;
  }
  // Prefer SMTP if configured (recommended for server-side sending)
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const SMTP_FROM = process.env.SMTP_FROM || "no-reply@tafaleka.com";

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT ? Number(SMTP_PORT) : 587,
      secure: SMTP_PORT ? Number(SMTP_PORT) === 465 : false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const mailOptions = {
      from: SMTP_FROM,
      to: toEmail,
      subject: "Kodi i verifikimit - TAFA",
      text: `KODI JUAJ I VERIFIKIMIT: ${code}`,
      html:
        `<div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;color:#111;">` +
        `<p><strong>KODI JUAJ I VERIFIKIMIT</strong></p><p style="font-size:20px;letter-spacing:2px">${code}</p>` +
        `</div>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("2FA email sent via SMTP:", info.messageId || info.response);
    return true;
  }

  // If we reach here, SMTP is not configured.
  // EmailJS does not allow REST API calls from non-browser (server) applications
  // so in production we should fail fast and instruct to configure SMTP.
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SMTP not configured. Configure SMTP_HOST, SMTP_USER and SMTP_PASS to send emails from the server. EmailJS REST is not allowed from server-side.",
    );
  }

  // Fall back to EmailJS REST if SMTP not configured (allowed only for non-production/dev)
  const payload = {
    service_id: EMAILJS_SERVICE,
    template_id: EMAILJS_TEMPLATE,
    user_id: EMAILJS_USER,
    template_params: {
      to_email: toEmail,
      code,
    },
  };

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`EmailJS failed: ${res.status} ${text}`);
  }
  return true;
}

// POST /api/auth/request-2fa
// Body: { email }
router.post("/request-2fa", async (req, res) => {
  try {
    const { email } = req.body;
    // Use configured admin emails (allow multiple recipients)
    if (!adminEmails || adminEmails.length === 0)
      return res.status(400).json({ error: "Admin email not configured." });
    if (email && !adminEmails.includes(email))
      return res.status(403).json({ error: "Forbidden" });

    // generate 6-digit code
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    const token = crypto.randomBytes(24).toString("hex");
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    const connection = await db.getConnection();
    await connection.query(
      `INSERT INTO admin_2fa_requests (token, email, code_hash, expires_at, attempts, used) VALUES (?, ?, ?, ?, 0, 0)`,
      [token, primaryAdminEmail, codeHash, expiresAt],
    );

    // If frontend will send the email via EmailJS, return the code to the client
    // Enable by setting ALLOW_FRONTEND_EMAILJS=true or VITE_ALLOW_FRONTEND_EMAIL=true
    const ALLOW_FRONTEND_EMAILJS =
      process.env.ALLOW_FRONTEND_EMAILJS === "true" ||
      process.env.VITE_ALLOW_FRONTEND_EMAIL === "true";

    if (ALLOW_FRONTEND_EMAILJS) {
      console.log(
        "Frontend EmailJS enabled: returning 2FA code to client for sending",
      );
      connection.release();
      return res.json({ token, code });
    }

    // send email to all configured admin recipients (may throw)
    await Promise.all(adminEmails.map((addr) => send2FAEmail(addr, code)));

    connection.release();
    return res.json({ token });
  } catch (err) {
    console.error("request-2fa error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to request 2FA" });
  }
});

// POST /api/auth/verify-2fa
// Body: { token, code }
router.post("/verify-2fa", async (req, res) => {
  try {
    const { token, code } = req.body;
    if (!token || !code)
      return res.status(400).json({ error: "Missing token or code" });

    const connection = await db.getConnection();
    const [rows] = await connection.query(
      `SELECT * FROM admin_2fa_requests WHERE token = ? LIMIT 1`,
      [token],
    );
    if (!rows || rows.length === 0) {
      connection.release();
      return res.status(404).json({ error: "Request not found" });
    }
    const reqRow = rows[0];
    if (reqRow.used) {
      connection.release();
      return res.status(400).json({ error: "Code already used" });
    }
    if (Date.now() > Number(reqRow.expires_at)) {
      // auto-resend a new code: create new row and send
      connection.release();
      return res.status(410).json({ error: "Code expired" });
    }

    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    if (codeHash !== reqRow.code_hash) {
      // increment attempts
      await connection.query(
        `UPDATE admin_2fa_requests SET attempts = attempts + 1 WHERE id = ?`,
        [reqRow.id],
      );
      connection.release();
      return res.status(401).json({ error: "Invalid code" });
    }

    // success -> mark used and create session token
    await connection.query(
      `UPDATE admin_2fa_requests SET used = 1 WHERE id = ?`,
      [reqRow.id],
    );
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const sessionExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    await connection.query(
      `INSERT INTO admin_sessions (session_token, expires_at) VALUES (?, ?)`,
      [sessionToken, sessionExpiry],
    );

    connection.release();

    // set HttpOnly cookie
    res.cookie("tafa_admin_session", sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      // secure should be true in production over HTTPS
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("verify-2fa error:", err);
    return res.status(500).json({ error: err.message || "Failed to verify" });
  }
});

// POST /api/auth/logout - clears session token server-side
router.post("/logout", async (req, res) => {
  try {
    const token = req.cookies?.tafa_admin_session || req.body?.token;
    if (token) {
      const connection = await db.getConnection();
      await connection.query(
        `DELETE FROM admin_sessions WHERE session_token = ?`,
        [token],
      );
      connection.release();
    }
    res.clearCookie("tafa_admin_session");
    return res.json({ success: true });
  } catch (err) {
    console.error("logout error:", err);
    return res.status(500).json({ error: "Logout failed" });
  }
});

module.exports = router;
