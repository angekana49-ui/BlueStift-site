// ==========================================
// BLUESTIFT - SERVICE WORKER
// Handles Web Push notifications
// ==========================================

self.addEventListener('push', event =>  {
  let data = {};
  try { data = event.data?.json() ?? {}; } catch (e) {}

  const title = data.title || 'BlueStift';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/web-app-manifest-192x192.png',
    badge: '/favicon-96x96.png',
    data: { url: data.url || '/schools.html' },
    vibrate: [200, 100, 200],
    tag: data.tag || 'bluestift',
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/schools.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Focus an existing dashboard tab if one is open
      for (const client of windowClients) {
        if (client.url.includes('schools.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
