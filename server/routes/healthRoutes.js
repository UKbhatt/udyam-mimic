import { Router } from 'express';
// healthRoute 
export const healthRouter = Router();
healthRouter.get('/', (_req, res) => res.json({ ok: true }));
