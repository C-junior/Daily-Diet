import { Request, Response } from 'express';
import {
  listMealsQuerySchema,
  mealIdParamSchema,
  mealPayloadSchema,
} from '../schemas/mealSchemas';
import { MealsService } from '../services/MealsService';

const mealsService = new MealsService();

export class MealsController {
  async create(req: Request, res: Response): Promise<void> {
    const payload = mealPayloadSchema.parse(req.body);
    const meal = await mealsService.create(req.user.id, payload);
    res.status(201).json({ meal });
  }

  async index(req: Request, res: Response): Promise<void> {
    const filters = listMealsQuerySchema.parse(req.query);
    const meals = await mealsService.listByUser(req.user.id, filters);
    res.status(200).json({ meals });
  }

  async show(req: Request, res: Response): Promise<void> {
    const { id } = mealIdParamSchema.parse(req.params);
    const meal = await mealsService.getById(req.user.id, id);
    res.status(200).json({ meal });
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = mealIdParamSchema.parse(req.params);
    const payload = mealPayloadSchema.parse(req.body);
    const meal = await mealsService.update(req.user.id, id, payload);
    res.status(200).json({ meal });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = mealIdParamSchema.parse(req.params);
    await mealsService.delete(req.user.id, id);
    res.status(204).send();
  }
}
