import { Router } from 'express';
import isValidProductId from '../middlewares/isValidProductId.js';
import isValidCartId from '../middlewares/isValidCartId.js';
import findCart from '../middlewares/findCart.js';
import findProductInCart from '../middlewares/findProductInCart.js';
import authorization from '../middlewares/authorization.js';
import { getCart, createCart, insertProductInCart, updateProductCart, updateQuantityProductCart, deleteProductCart, deleteCart  } from '../controllers/cartsController.js';

const cartRouter = Router();

cartRouter.get('/:cid', isValidCartId, findCart, getCart);
cartRouter.post('/', authorization('Usuario'), createCart);
cartRouter.post('/:cid/products/:pid', isValidCartId, findCart, isValidProductId, authorization('Usuario'), insertProductInCart);
cartRouter.put('/:cid', isValidCartId, findCart, authorization('Usuario'), updateProductCart);
cartRouter.put('/:cid/products/:pid', isValidCartId, isValidProductId, findCart, findProductInCart, authorization('Usuario'), updateQuantityProductCart);
cartRouter.delete('/:cid/products/:pid', isValidCartId, isValidProductId, findCart, findProductInCart, authorization('Usuario'), deleteProductCart);
cartRouter.delete('/:cid', isValidCartId, authorization('Usuario'), deleteCart);

export default cartRouter;