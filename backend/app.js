const express = require('express');
const cors = require('cors');
const sequelize = require('./sequelize');
const Entry = require('./models/entry');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

sequelize.sync().then(() => console.log("DB connected and synced"));

app.get('/api/entries', async (req, res) => {
  const entries = await Entry.findAll({ order: [['date', 'DESC']] });
  res.json(entries);
});

app.post('/api/entries', async (req, res) => {
  const { text } = req.body;
  const date = new Date().toISOString().slice(0, 10);

  const existing = await Entry.findOne({ where: { date } });
  if (existing) {
    return res.status(400).json({ message: '今日すでに投稿しています' });
  }

  const newEntry = await Entry.create({ text, date });
  res.status(201).json(newEntry);
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});