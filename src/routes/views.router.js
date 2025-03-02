import { Router } from 'express';
import productModel from '../models/products.model.js';
import cartModel from '../models/carts.model.js';
import { getHome, getCart, getProduct, getRealTimeProducts, getError } from '../controllers/viewsController.js';

const viewsRouter = Router();

viewsRouter.get('/home', getHome);
viewsRouter.get('/carts/:id', getCart);
viewsRouter.get('/products/:id', getProduct);
viewsRouter.get('/realtimeproducts', getRealTimeProducts);
viewsRouter.get('/error', getError);

export default viewsRouter;
