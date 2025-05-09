const express = require('express');
const router = express.Router();
const Venue = require('../models/Events');

// GET /api/eventspaces - fetch all event spaces
router.get('/', async (req, res) => {
  try {
    const eventspaces = await Venue.find();
    res.json(eventspaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/eventspaces/:id - fetch single event space
router.get('/:id', async (req, res) => {
  try {
    const eventspace = await Venue.findById(req.params.id);
    if (!eventspace) return res.status(404).json({ error: 'Not found' });
    res.json(eventspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
