import { Router } from 'express';
import isValidProductId from '../middlewares/isValidProductId.js';
import authorization from '../middlewares/authorization.js';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productsController.js';

const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.get('/:pid', isValidProductId, getProduct);
productRouter.post('/', authorization('Admin'), createProduct);
productRouter.put('/:pid', authorization('Admin'), isValidProductId, updateProduct);
productRouter.delete('/:pid', isValidProductId, authorization('Admin'), deleteProduct);


export default productRouter;