// src/backend/routes/draft.js
import express from 'express';
import { getDB } from '../models/db.js';
import { nanoid } from 'nanoid';

const router = express.Router();

// Create Draft
router.post('/', async (req, res) => {
    const db = await getDB();
    await db.read();
    const draftId = `draft_${nanoid()}`;
    const draft = { id: draftId, payload: req.body.payload, createdAt: new Date().toISOString() };
    db.data.drafts.push(draft);
    await db.write();
    res.json(draft);
});

// Get Draft
router.get('/:id', async (req, res) => {
    const db = await getDB();
    await db.read();
    const draft = db.data.drafts.find(d => d.id === req.params.id);
    if (!draft) return res.status(404).json({ error: 'Draft not found' });
    res.json(draft);
});

// Patch Draft
router.patch('/:id', async (req, res) => {
    const db = await getDB();
    await db.read();
    const draft = db.data.drafts.find(d => d.id === req.params.id);
    if (!draft) return res.status(404).json({ error: 'Draft not found' });
    draft.payload = req.body.payload;
    draft.updatedAt = new Date().toISOString();
    await db.write();
    res.json(draft);
});

export default router;
