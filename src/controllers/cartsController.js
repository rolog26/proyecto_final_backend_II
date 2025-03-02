import cartModel from '../models/carts.model.js';
import productModel from '../models/products.model.js';
import ticketModel from '../models/ticket.model.js';

export const getCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findOne({_id: cartId});
        if (cart){
            res.status(200).send(cart);
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (error) {
        res.status(500).render('templates/error', { error });
    }
}

export const createCart = async (req, res) => {
    try {
        const respuesta = await cartModel.create({products: []});
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
        const cart = await cartModel.findOne({_id: cartId});
        if (cart) {
            const index = cart.products.findIndex(prod => prod._id == productId);
            if (index != -1) {
                cart.products[index].quantity = quantity;
            } else {
                cart.products.push({id_prod: productId, quantity: quantity});
            }

            const respuesta = await cartModel.findByIdAndUpdate(cartId, cart);
            return res.status(200).send(respuesta);
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (error) {
        res.status(500).render('templates/error', { error });
    }
}

export const updateProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const {newProduct} = req.body;
        const cart = await cartModel.findOne({_id: cartId});
        cart.products = newProduct;
        cart.save();
    } catch (error) {
        res.status(500).render('templates/error', { error });
    }
}

export const updateQuantityProductCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const {quantity} = req.body;
    const cart = await cartModel.findOne({_id: cartId});
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
        const cart = await cartModel.findOne({_id: cartId});
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
        res.status(500).render('templates/error', { error });
    }
}

export const deleteCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findOne({_id: cartId});
        if (cart) {
            cart.products = [];
            cart.save();
            return res.status(200).send(cart);
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (error) {
        res.status(500).render('templates/error', { error });
    }
}

export const checkout = async (req, res) => {
    try {
        console.log(req.user);
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId);
        const prodStockNull = []
        if (cart) {
            for (const prod of cart.products) {
                let producto = await productModel.findById(prod.id_prod)
                if (producto.stock - prod.quantity < 0) {
                    prodStockNull.push(producto.id);
                }
            }
            if (prodStockNull.length === 0) {
                let totalAmount = 0

                for(const prod of cart.products) {
                    const producto = await productModel.findById(prod.id_prod)
                    if (producto) {
                        producto.stock -= prod.quantity
                        totalAmount += producto.price * prod.quantity
                        await producto.save()
                    }
                }
                
                console.log(req);
                const newTicket = await ticketModel.create({
                    code: crypto.randomUUID(),
                    purchaser: req.user.email,
                    amount: totalAmount,
                    products: cart.products
                })

                await cartModel.findByIdAndUpdate(cartId, { products: [] })
                res.status(200).send(newTicket)
            } else {
                prodStockNull.forEach((prodId) => {
                    let index = cart.products.findIndex(prod => prod.id == prodId)
                    cart.products.splice(index, 1)
                })
                await cartModel.findByIdAndUpdate(cartId, {
                    products: cart.products
                })
                res.status(400).send(prodStockNull);
            }
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (error) {
        res.status(500).render('templates/error', { error });
    }
}