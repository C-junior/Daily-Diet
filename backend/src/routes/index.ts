import { Router } from 'express';
import { mealsRouter } from './meals.routes';
import { sessionsRouter } from './sessions.routes';
import { usersRouter } from './users.routes';

const routes = Router();

routes.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'daily-diet-api' });
});

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/meals', mealsRouter);

export { routes };
