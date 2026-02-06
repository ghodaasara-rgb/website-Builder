// src/backend/routes/version.js
import express from 'express';
import { getDB } from '../models/db.js';

const router = express.Router();

// Record a new version for a draft
router.post('/', async (req, res) => {
    const { draftId, version, changeSummary } = req.body;
    const db = await getDB();
    await db.read();
    const versionEntry = { draftId, version, changeSummary, timestamp: new Date().toISOString() };
    db.data.versions.push(versionEntry);
    await db.write();
    res.json(versionEntry);
});

// Get versions for a draft
router.get('/', async (req, res) => {
    const { draftId } = req.query;
    const db = await getDB();
    await db.read();
    const versions = db.data.versions.filter(v => v.draftId === draftId);
    res.json(versions);
});

export default router;
