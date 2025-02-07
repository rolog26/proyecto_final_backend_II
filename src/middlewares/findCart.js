import cartModel from '../models/carts.model.js';

const findCart = async (req, res, next) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId).populate('products.product');
        if (!cart) {
            return res.status(404).json({ result: 'error', error: 'Carrito no encontrado' });
        }

        req.cart = cart;
        next();
    } catch (error) {
        (error);
        res.status(500).json({ result: 'error', error: 'Error al obtener el carrito' });
    }
}

export default findCart;