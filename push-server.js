const express = require('express');
const webpush = require('web-push');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

webpush.setVapidDetails(
  'mailto:admin@goruslugimsk.ru',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const db = new sqlite3.Database('/data/push-subscriptions.db');
db.run(`CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.get('/api/push/vapid-public-key', (req, res) => {
  res.json({ key: process.env.VAPID_PUBLIC_KEY });
});

app.post('/api/push/subscribe', (req, res) => {
  const { endpoint, keys } = req.body;
  db.run(
    'INSERT OR REPLACE INTO subscriptions (endpoint, p256dh, auth) VALUES (?,?,?)',
    [endpoint, keys.p256dh, keys.auth],
    err => err ? res.status(500).json({ error: err.message }) : res.json({ ok: true })
  );
});

app.post('/api/push/send', (req, res) => {
  const payload = JSON.stringify(req.body);
  db.all('SELECT * FROM subscriptions', async (err, subs) => {
    if (err) return res.status(500).json({ error: err.message });
    const results = await Promise.allSettled(
      subs.map(s => webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        payload
      ))
    );
    res.json({ sent: results.filter(r => r.status === 'fulfilled').length, total: subs.length });
  });
});

app.listen(3001, () => console.log('Push server :3001 OK'));
