import { Router } from 'express';
import { UsersController } from '../controllers/UsersController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { asyncHandler } from '../utils/asyncHandler';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post('/', asyncHandler((req, res) => usersController.create(req, res)));
usersRouter.get(
  '/me',
  ensureAuthenticated,
  asyncHandler((req, res) => usersController.me(req, res)),
);
usersRouter.patch(
  '/me',
  ensureAuthenticated,
  asyncHandler((req, res) => usersController.updateMe(req, res)),
);

export { usersRouter };
