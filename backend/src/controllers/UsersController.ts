import { Request, Response } from 'express';
import { registerUserSchema, updateProfileSchema } from '../schemas/userSchemas';
import { UsersService } from '../services/UsersService';

const usersService = new UsersService();

export class UsersController {
  async create(req: Request, res: Response): Promise<void> {
    const payload = registerUserSchema.parse(req.body);
    const { user, token } = await usersService.register(payload);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ user, token });
  }

  async me(req: Request, res: Response): Promise<void> {
    const user = await usersService.getProfile(req.user.id);
    res.status(200).json({ user });
  }

  async updateMe(req: Request, res: Response): Promise<void> {
    const payload = updateProfileSchema.parse(req.body);
    const user = await usersService.updateProfile(req.user.id, payload);
    res.status(200).json({ user });
  }
}
