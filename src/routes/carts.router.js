import { Router } from 'express';
import authorization from '../middlewares/authorization.js';
import { getCart, createCart, insertProductInCart, updateProductCart, updateQuantityProductCart, deleteProductCart, deleteCart, checkout  } from '../controllers/cartsController.js';

const cartRouter = Router();

cartRouter.get('/:cid', getCart);
cartRouter.post('/', authorization('Usuario'), createCart);
cartRouter.post('/:cid/products/:pid', insertProductInCart);
cartRouter.put('/:cid', authorization('Usuario'), updateProductCart);
cartRouter.put('/:cid/products/:pid', authorization('Usuario'), updateQuantityProductCart);
cartRouter.delete('/:cid/products/:pid', authorization('Usuario'), deleteProductCart);
cartRouter.delete('/:cid', authorization('Usuario'), deleteCart);
cartRouter.post('/:cid/checkout', checkout);

export default cartRouter;