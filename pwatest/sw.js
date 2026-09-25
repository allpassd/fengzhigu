/* 晨会 · 真机验证 Service Worker
   唯一职责：收到推送就弹通知。这是「它自己到」的最后一环。 */

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (e) {
  var data = {};
  try {
    data = e.data ? e.data.json() : {};
  } catch (err) {
    try { data = { body: e.data.text() }; } catch (err2) { data = {}; }
  }
  var title = data.title || '晨会';
  var body = data.body || '（无内容）';
  e.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      tag: 'morning-test',
      renotify: true,
      badge: undefined,
      data: { ts: Date.now() }
    })
  );
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if ('focus' in list[i]) return list[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});
