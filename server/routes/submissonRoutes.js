import { Router } from 'express';
import { submit } from '../controllers/submissionController.js';

export const submissionRouter = Router();
submissionRouter.post('/', submit);
