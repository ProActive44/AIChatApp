import express from 'express';
import { createGroup } from '../controllers/groupController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// Create a group
router.post('/create', createGroup);

export default router;
