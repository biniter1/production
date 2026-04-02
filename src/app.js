const express = require('express');
const app = express();

app.use(express.json());

// Health check endpoint — dùng cho smoke test trong pipeline
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    version: process.env.APP_VERSION || 'local',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello from GitHub Actions demo app!' });
});

app.post('/add', (req, res) => {
  const { a, b } = req.body;
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'a and b must be numbers' });
  }
  res.json({ result: a + b });
});

module.exports = app;
