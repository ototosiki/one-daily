const express = require('express');
const cors = require('cors');
const sequelize = require('./sequelize');
const Entry = require('./models/entry');
const { Op } = require('sequelize');
const retry = require('async-retry');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const connectWithRetry = async () => {
  try {
    await retry(async () => {
      console.log('Attempting to connect to the database...');
      await sequelize.sync();
      console.log('DB connected and synced');
    }, {
      retries: 5,
      minTimeout: 2000,
      onRetry: (err, attempt) => {
        console.error(`Connection attempt ${attempt} failed: ${err.message}. Retrying...`);
      }
    });
  } catch (error) {
    console.error('Failed to connect to the database after multiple retries. Exiting.');
    process.exit(1);
  }
};

const startServer = async () => {
  await connectWithRetry();

  app.get('/api/entries', async (req, res) => {
    try {
      const entries = await Entry.findAll({ order: [['date', 'DESC']] });
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching entries', error: error.message });
    }
  });

  app.post('/api/entries', async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'Entry text cannot be empty' });
      }
      const newEntry = await Entry.create({ text, date: new Date() });
      res.status(201).json(newEntry);
    } catch (error) {
      res.status(500).json({ message: 'Error creating entry', error: error.message });
    }
  });

  app.delete('/api/entries/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Entry.destroy({
        where: { id: id }
      });

      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Entry not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting entry', error: error.message });
    }
  });

  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
};

startServer();