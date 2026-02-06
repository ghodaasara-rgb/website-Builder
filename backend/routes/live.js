// src/backend/routes/live.js
import express from 'express';
import { getDB } from '../models/db.js';
import { nanoid } from 'nanoid';

const router = express.Router();

// Publish Draft → Live snapshot
router.post('/', async (req, res) => {
    const { draftId } = req.body;
    const db = await getDB();
    await db.read();
    const draft = db.data.drafts.find(d => d.id === draftId);
    if (!draft) return res.status(404).json({ error: 'Draft not found' });
    const liveId = `live_${nanoid()}`;
    const live = { id: liveId, draftSourceId: draftId, payload: draft.payload, publishedAt: new Date().toISOString() };
    db.data.live.push(live);
    await db.write();
    res.json(live);
});

// Get Live snapshot
router.get('/:id', async (req, res) => {
    const db = await getDB();
    await db.read();
    const live = db.data.live.find(l => l.id === req.params.id);
    if (!live) return res.status(404).json({ error: 'Live not found' });
    res.json(live);
});

export default router;
