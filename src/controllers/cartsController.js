import cartsModel from '../models/carts.model.js';

export const getCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartsModel.findById({_id: cartId});
        if (cart){
            res.status(200).send(cart);
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (error) {
        res.status(500).send('templates/error', { error });
    }
}

export const createCart = async (req, res) => {
    try {
        const respuesta = await cartsModel.create({products: []});
        res.status(201).send(respuesta);
    } catch (error) {
        res.status(500).render('templates/error', { error });
    }
}

export const insertProductInCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const {quantity} = req.body;
        const cart = await cartsModel.findOne({_id: cartId});
        if (cart) {
            const index = cart.products.findIndex(product => product.id_product.toString() === productId);
            if (index != 1) {
                cart.products[index].quantity += quantity;
            } else {
                cart.products.push({id_product: productId, quantity});
            }

            const respuesta = await cartsModel.findByIdAndUpdate(cartId, cart);
            return res.status(200).send(respuesta);
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (error) {
        res.status(500).send('templates/error', { error });
    }
}

export const updateProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const {newProduct} = req.body;
        const cart = await cartsModel.findOne({_id: cartId});
        cart.products = newProduct;
        cart.save();
    } catch (error) {
        res.status(500).send('templates/error', { error });
    }
}

export const updateQuantityProductCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const {quantity} = req.body;
    const cart = await cartsModel.findOne({_id: cartId});
    if (cart) {
        const index = cart.products.findIndex(product => product.id_product.toString() === productId);
        if (index != -1) {
            cart.products[index].quantity = quantity;
            cart.save();
            return res.status(200).send(cart);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    }
}

export const deleteProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartsModel.findOne({_id: cartId});
        if (cart) {
            const index = cart.products.findIndex(product => product.id_product.toString() === productId);
            if (index != -1) {
                cart.products.splice(index, 1);
                cart.save();
                return res.status(200).send(cart);
            } else {
                res.status(404).send('Producto no encontrado');
            }
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (error) {
        res.status(500).send('templates/error', { error });
    }
}

export const deleteCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartsModel.findOne({_id: cartId});
        if (cart) {
            cart.products = [];
            cart.save();
            return res.status(200).send(cart);
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (error) {
        res.status(500).send('templates/error', { error });
    }
}