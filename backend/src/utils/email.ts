import nodemailer from 'nodemailer';

// ── Transporter ──────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

// ── Send Email ────────────────────────────────────────────────
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@assetiq.com';
  const alertEmail = process.env.ALERT_EMAIL;

  // If no SMTP configured, log and skip
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`📧 [EMAIL SKIPPED - No SMTP config] To: ${options.to} | Subject: ${options.subject}`);
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: `"AssetIQ System" <${from}>`,
      to: Array.isArray(options.to) ? options.to.join(',') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    console.log(`✅ [EMAIL SENT] To: ${options.to} | MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ [EMAIL ERROR] Failed to send to ${options.to}:`, error);
    return false;
  }
}

// ── Email Templates ───────────────────────────────────────────
export const emailTemplates = {
  slaBreachAlert: (woNo: string, equipmentName: string) => ({
    subject: `🚨 SLA Breach Alert — Work Order ${woNo}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:#dc2626;padding:20px;text-align:center;">
          <h2 style="color:white;margin:0;">⚠️ SLA Breach Alert</h2>
        </div>
        <div style="padding:24px;">
          <p style="font-size:16px;color:#333;">A Work Order has exceeded its SLA deadline and requires <strong>immediate action</strong>.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr style="background:#fef2f2;">
              <td style="padding:10px;border:1px solid #fca5a5;font-weight:bold;">Work Order No</td>
              <td style="padding:10px;border:1px solid #fca5a5;">${woNo}</td>
            </tr>
            <tr>
              <td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">Equipment</td>
              <td style="padding:10px;border:1px solid #e5e7eb;">${equipmentName}</td>
            </tr>
            <tr style="background:#fef2f2;">
              <td style="padding:10px;border:1px solid #fca5a5;font-weight:bold;">Status</td>
              <td style="padding:10px;border:1px solid #fca5a5;color:#dc2626;font-weight:bold;">SLA BREACHED</td>
            </tr>
          </table>
          <p style="color:#666;">Please log into the AssetIQ system to take immediate action.</p>
          <div style="text-align:center;margin-top:24px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/work-orders" 
               style="background:#dc2626;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
              View Work Order →
            </a>
          </div>
        </div>
        <div style="background:#f9fafb;padding:12px;text-align:center;color:#9ca3af;font-size:12px;">
          AssetIQ Enterprise Asset Management System — Automated Alert
        </div>
      </div>
    `,
  }),

  pmWorkOrderCreated: (woNo: string, planName: string, dueDate: Date) => ({
    subject: `🔧 PM Work Order Created — ${woNo}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:#2563eb;padding:20px;text-align:center;">
          <h2 style="color:white;margin:0;">🔧 Preventive Maintenance Scheduled</h2>
        </div>
        <div style="padding:24px;">
          <p style="font-size:16px;color:#333;">A new Preventive Maintenance Work Order has been automatically generated.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr style="background:#eff6ff;">
              <td style="padding:10px;border:1px solid #bfdbfe;font-weight:bold;">Work Order No</td>
              <td style="padding:10px;border:1px solid #bfdbfe;">${woNo}</td>
            </tr>
            <tr>
              <td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">PM Plan</td>
              <td style="padding:10px;border:1px solid #e5e7eb;">${planName}</td>
            </tr>
            <tr style="background:#eff6ff;">
              <td style="padding:10px;border:1px solid #bfdbfe;font-weight:bold;">Due Date</td>
              <td style="padding:10px;border:1px solid #bfdbfe;">${dueDate.toLocaleDateString('en-BD')}</td>
            </tr>
          </table>
          <div style="text-align:center;margin-top:24px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/work-orders" 
               style="background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
              View Work Orders →
            </a>
          </div>
        </div>
        <div style="background:#f9fafb;padding:12px;text-align:center;color:#9ca3af;font-size:12px;">
          AssetIQ Enterprise Asset Management System — Automated Alert
        </div>
      </div>
    `,
  }),

  utilityThresholdAlert: (meterNo: string, utilityType: string, reading: number, threshold: number, type: 'LOW' | 'HIGH') => ({
    subject: `⚡ Utility ${type === 'LOW' ? 'Low' : 'High'} Threshold Alert — ${meterNo}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:${type === 'HIGH' ? '#dc2626' : '#d97706'};padding:20px;text-align:center;">
          <h2 style="color:white;margin:0;">⚡ Utility Threshold ${type === 'HIGH' ? 'Exceeded' : 'Below Minimum'}</h2>
        </div>
        <div style="padding:24px;">
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">Meter No</td><td style="padding:10px;border:1px solid #e5e7eb;">${meterNo}</td></tr>
            <tr><td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">Utility Type</td><td style="padding:10px;border:1px solid #e5e7eb;">${utilityType}</td></tr>
            <tr><td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">Current Reading</td><td style="padding:10px;border:1px solid #e5e7eb;color:${type === 'HIGH' ? '#dc2626' : '#d97706'};font-weight:bold;">${reading}</td></tr>
            <tr><td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">${type} Threshold</td><td style="padding:10px;border:1px solid #e5e7eb;">${threshold}</td></tr>
          </table>
          <p style="color:#666;">Please investigate and take necessary action.</p>
        </div>
        <div style="background:#f9fafb;padding:12px;text-align:center;color:#9ca3af;font-size:12px;">
          AssetIQ HFM Module — Automated Alert
        </div>
      </div>
    `,
  }),
};
