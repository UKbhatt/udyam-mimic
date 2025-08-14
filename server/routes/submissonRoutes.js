import { Router } from 'express';
import { submit } from '../controllers/submissionController.js';
// routes for Submission of Data
export const submissionRouter = Router();
submissionRouter.post('/', submit);
