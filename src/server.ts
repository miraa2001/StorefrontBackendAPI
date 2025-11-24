import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRoutes from './handlers/users';
import productsRoutes from './handlers/products';
import orderRoutes from './handlers/orders';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response): void => {
  res.send('Storefront Backend is running');
});

// mount user routes
usersRoutes(app);
productsRoutes(app);
orderRoutes(app);

app.listen(port, (): void => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
