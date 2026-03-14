// ==========================================
// VERCEL SERVERLESS FUNCTION
// Endpoint: /api/send-push
// Sends Web Push notification to all
// subscribed admin devices.
// ==========================================

import webpush from 'web-push';

const {
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY,
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
} = process.env;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:russel@thebluestift.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Require internal secret to prevent unauthenticated abuse
  const INTERNAL_SECRET = process.env.INTERNAL_SECRET;
  if (!INTERNAL_SECRET || req.headers['x-internal-secret'] !== INTERNAL_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Skip silently if push is not configured
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return res.status(200).json({ skipped: 'Push not configured (missing VAPID keys)' });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(200).json({ skipped: 'Push not configured (missing Supabase service key)' });
  }

  const { title, body, url = '/schools.html', tag } = req.body || {};

  // Fetch stored push subscriptions from Supabase
  let subscriptions = [];
  try {
    const dbRes = await fetch(
      `${SUPABASE_URL}/rest/v1/push_subscriptions?select=id,endpoint,keys`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );
    if (dbRes.ok) {
      subscriptions = await dbRes.json();
    }
  } catch (e) {
    console.error('Failed to fetch subscriptions:', e);
    return res.status(500).json({ error: 'Database error' });
  }

  if (!subscriptions.length) {
    return res.status(200).json({ sent: 0, message: 'No subscribers' });
  }

  const payload = JSON.stringify({ title, body, url, tag });

  const results = await Promise.allSettled(
    subscriptions.map(sub =>
      webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, payload)
    )
  );

  // Remove expired subscriptions (410 Gone / 404)
  const expiredEndpoints = results
    .map((r, i) =>
      r.status === 'rejected' &&
      (r.reason?.statusCode === 410 || r.reason?.statusCode === 404)
        ? subscriptions[i].endpoint
        : null
    )
    .filter(Boolean);

  if (expiredEndpoints.length) {
    const encodedList = expiredEndpoints.map(e => encodeURIComponent(e)).join(',');
    await fetch(
      `${SUPABASE_URL}/rest/v1/push_subscriptions?endpoint=in.(${encodedList})`,
      {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    ).catch(console.error);
  }

  const sent = results.filter(r => r.status === 'fulfilled').length;
  return res.status(200).json({ sent });
}
