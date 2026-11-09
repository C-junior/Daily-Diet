import { Request, Response } from 'express';
import { loginSessionSchema } from '../schemas/userSchemas';
import { SessionsService } from '../services/SessionsService';

const sessionsService = new SessionsService();

export class SessionsController {
  async create(req: Request, res: Response): Promise<void> {
    const payload = loginSessionSchema.parse(req.body);
    const { user, token } = await sessionsService.authenticate(payload);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user, token });
  }

  async createDemo(_req: Request, res: Response): Promise<void> {
    const { user, token } = await sessionsService.authenticateDemo();

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user, token });
  }

  async destroy(_req: Request, res: Response): Promise<void> {
    res.clearCookie('token');
    res.status(204).send();
  }
}
