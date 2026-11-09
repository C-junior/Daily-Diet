import { Router } from 'express';
import { SessionsController } from '../controllers/SessionsController';
import { asyncHandler } from '../utils/asyncHandler';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post('/', asyncHandler((req, res) => sessionsController.create(req, res)));
sessionsRouter.post('/demo', asyncHandler((req, res) => sessionsController.createDemo(req, res)));
sessionsRouter.delete('/', asyncHandler((req, res) => sessionsController.destroy(req, res)));

export { sessionsRouter };
