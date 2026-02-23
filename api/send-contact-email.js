// ==========================================
// VERCEL SERVERLESS FUNCTION
// Endpoint: /api/send-contact-email
// Sends email notification via Resend API
// when a support message is submitted.
// ==========================================

export default async function handler(req, res) {
  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Check API key is configured
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  // Parse body
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Build HTML email
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 12px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px 24px; border-radius: 8px; margin-bottom: 24px;">
        <h1 style="color: white; margin: 0; font-size: 1.25rem;">📬 New Support Message</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 0.9rem;">BlueStift Dashboard</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 0.875rem; width: 100px;">From</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #111827;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 0.875rem;">Email</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            <a href="mailto:${escapeHtml(email)}" style="color: #667eea;">${escapeHtml(email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #6b7280; font-size: 0.875rem;">Subject</td>
          <td style="padding: 10px 0; font-weight: 600; color: #111827;">${escapeHtml(subject)}</td>
        </tr>
      </table>

      <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Message</h3>
        <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
      </div>

      <a href="mailto:${escapeHtml(email)}?subject=Re: ${escapeHtml(subject)}"
         style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.9rem;">
        Reply to ${escapeHtml(name)}
      </a>

      <p style="margin-top: 24px; font-size: 0.75rem; color: #9ca3af;">
        Sent via BlueStift Dashboard support form · ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Douala' })} WAT
      </p>
    </div>
  `;

  // Call Resend API
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'BlueStift Dashboard <noreply@thebluestift.com>',
        to: 'russel@thebluestift.com',
        reply_to: email,
        subject: `[Support] ${subject} — ${name}`,
        html,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Resend API error:', errText);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Fire-and-forget push notification to admin device(s)
    fetch(`${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/api/send-push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `📬 New message from ${name}`,
        body: message.length > 120 ? message.substring(0, 120) + '…' : message,
        url: '/schools.html',
        tag: 'contact-message',
      }),
    }).catch(e => console.warn('Push notification failed:', e));

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Simple XSS protection for HTML email
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
