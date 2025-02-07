const findProductInCart = (req, res, next) => {
    const { cart } = req;
    const productId = req.params.pid;
    
    const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
    if (productIndex === -1) {
        return res.status(404).json({ result: 'error', error: 'Producto no encontrado en el carrito' });
    }
    req.productIndex = productIndex;
    next();
}

export default findProductInCart;