import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { TOKEN_SECRET } = process.env;

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      res.status(401).json({ error: 'Missing Authorization header' });
      return;
    }

    const token = authorizationHeader.split(' ')[1];

    jwt.verify(token, TOKEN_SECRET as string);

    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token', details: `${err}` });
  }
};
