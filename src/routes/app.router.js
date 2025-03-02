import { Router } from 'express';
import productRouter from './products.router.js';
import cartRouter from './carts.router.js';
import sessionRouter from './sessions.routes.js';

const appRouter = Router();

appRouter.use('/api/products', productRouter);
appRouter.use('/api/carts', cartRouter);
appRouter.use('/api/sessions', sessionRouter);

export default appRouter;