import cartModel from '../models/carts.model.js';
import productModel from '../models/products.model.js';
import ticketModel from '../models/ticket.model.js';
import crypto from 'crypto';

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

        const quantity = req.body.quantity ? Number(req.body.quantity) : 1;

        const cart = await cartModel.findOne({ _id: cartId });
        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
          }

          const product = await productModel.findById(productId);
          if (!product) {
            return res.status(404).send("Producto no encontrado");
          }

          const index = cart.products.findIndex(
            (prod) => prod.id_prod && prod.id_prod.toString() === productId
          );

          if (index !== -1) {
            cart.products[index].quantity = quantity;
          } else {
            cart.products.push({
              id_prod: productId,
              quantity: quantity,
            });
          }
      
          await cart.save();

          const updatedCart = await cartModel.findById(cartId);
    return res.status(200).send(updatedCart);
    } catch (error) {
        console.error("Error al insertar producto en carrito:", error);
        res.status(500).render("templates/error", { error });
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
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId);
        const prodStockNull = [];
    
        if (!cart) {
          return res.status(404).send("Carrito no encontrado");
        }
    
        if (!cart.products.length) {
          return res.status(400).send("El carrito está vacío");
        }
    
        for (const prod of cart.products) {
          if (prod.quantity === undefined || prod.quantity === null) {
            console.log(`Producto ${prod.id_prod} sin cantidad definida`);
            prodStockNull.push(prod.id_prod);
            continue;
          }
    
          let producto = await productModel.findById(prod.id_prod);
          if (!producto) {
            console.log(
              `Producto ${prod.id_prod} no encontrado en la base de datos`
            );
            prodStockNull.push(prod.id_prod);
            continue;
          }
    
          const currentStock = Number(producto.stock);
          const quantity = Number(prod.quantity);
    
          if (isNaN(currentStock) || isNaN(quantity)) {
            console.log(
              `Error: Valores inválidos - stock: ${producto.stock}, quantity: ${prod.quantity}`
            );
            prodStockNull.push(prod.id_prod);
            continue;
          }
    
          if (currentStock - quantity < 0) {
            console.log(
              `Stock insuficiente para ${prod.id_prod}: stock=${currentStock}, cantidad solicitada=${quantity}`
            );
            prodStockNull.push(prod.id_prod);
          }
        }
    
        if (prodStockNull.length === 0) {
          let totalAmount = 0;
    
          for (const prod of cart.products) {
            const producto = await productModel.findById(prod.id_prod);
            if (producto && prod.quantity !== undefined && prod.quantity !== null) {
              const currentStock = Number(producto.stock);
              const quantity = Number(prod.quantity);
              const price = Number(producto.price);
    
              if (!isNaN(currentStock) && !isNaN(quantity) && !isNaN(price)) {
                producto.stock = currentStock - quantity;
                totalAmount += price * quantity;
                await producto.save();
              } else {
                console.log(
                  `Error: No se puede procesar el producto ${prod.id_prod} - valores inválidos`
                );
              }
            }
          }
    
          const newTicket = await ticketModel.create({
            code: crypto.randomUUID(),
            purchaser: req.user.email,
            amount: totalAmount,
            products: cart.products,
          });
    
          await cartModel.findByIdAndUpdate(cartId, { products: [] });
          return res.status(200).send(newTicket);
        } else {
          const productsWithoutStockInfo = [];
          for (const prodId of prodStockNull) {
            const prod = await productModel.findById(prodId);
            if (prod) {
              productsWithoutStockInfo.push({
                id: prod._id,
                title: prod.title,
                stock: prod.stock,
              });
            } else {
              productsWithoutStockInfo.push({
                id: prodId,
                error: "Producto no encontrado",
              });
            }
          }
    
          const validProducts = cart.products.filter(
            (prod) => !prodStockNull.includes(String(prod.id_prod))
          );
    
          await cartModel.findByIdAndUpdate(cartId, {
            products: validProducts,
          });
    
          return res.status(400).send({
            error:
              "Algunos productos no tienen stock suficiente o presentan problemas",
            productsWithoutStock: productsWithoutStockInfo,
          });
        }
      } catch (error) {
        console.error("Error en checkout:", error);
        res
          .status(500)
          .render("templates/error", { error: error.message || error });
      }
    };