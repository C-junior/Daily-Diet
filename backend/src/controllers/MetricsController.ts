import { Request, Response } from 'express';
import { MetricsService } from '../services/MetricsService';

const metricsService = new MetricsService();

export class MetricsController {
  async show(req: Request, res: Response): Promise<void> {
    const metrics = await metricsService.getUserMetrics(req.user.id);
    res.status(200).json({ metrics });
  }
}
