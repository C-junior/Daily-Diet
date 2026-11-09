import { Router } from 'express';
import { MealsController } from '../controllers/MealsController';
import { MetricsController } from '../controllers/MetricsController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { asyncHandler } from '../utils/asyncHandler';

const mealsRouter = Router();
const mealsController = new MealsController();
const metricsController = new MetricsController();

mealsRouter.use(ensureAuthenticated);

mealsRouter.get('/metrics', asyncHandler((req, res) => metricsController.show(req, res)));
mealsRouter.post('/', asyncHandler((req, res) => mealsController.create(req, res)));
mealsRouter.get('/', asyncHandler((req, res) => mealsController.index(req, res)));
mealsRouter.get('/:id', asyncHandler((req, res) => mealsController.show(req, res)));
mealsRouter.put('/:id', asyncHandler((req, res) => mealsController.update(req, res)));
mealsRouter.delete('/:id', asyncHandler((req, res) => mealsController.delete(req, res)));

export { mealsRouter };
