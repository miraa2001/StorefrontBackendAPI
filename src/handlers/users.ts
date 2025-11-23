import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserModel } from '../models/user';
import { verifyAuthToken } from '../middleware/auth';

dotenv.config();

const { TOKEN_SECRET } = process.env;

const userModel = new UserModel();

const index = async (_req: Request, res: Response) => {
  const users = await userModel.index();
  res.json(users);
};

const show = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = await userModel.show(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

const create = async (req: Request, res: Response) => {
  const { firstname, lastname, password } = req.body;

  const user = await userModel.create({ firstname, lastname, password });

  const token = jwt.sign({ user }, TOKEN_SECRET as string);

  res.json({ user, token });
};

const authenticate = async (req: Request, res: Response) => {
  const { firstname, password } = req.body;

  const user = await userModel.authenticate(firstname, password);

  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ user }, TOKEN_SECRET as string);

  res.json({ user, token });
};

export default function usersRoutes(app: express.Application) {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
  app.post('/users/auth', authenticate);
}
