import productModel from "../models/products.model.js";
import cartModel from "../models/carts.model.js";

export const getHome = async (req, res) => {
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let query = req.query.query || '';
        let sort = req.query.sort ? parseInt(req.query.sort) : 1;

        let result = await productModel.paginate(
            { title: { $regex: query, $options: 'i' } },
            {
                limit: limit,
                page: page,
                sort: { price: sort },
                lean: true
            }
        );

        result.prevLink = result.hasPrevPage ? `/home?query=${query}&limit=${limit}&page=${result.prevPage}` : '';
        result.nextLink = result.hasNextPage ? `/home?query=${query}&limit=${limit}&page=${result.nextPage}` : '';

        result.isValid = !(page < 1 || page > result.totalPages || ![1, -1].includes(sort));

        res.render('templates/home', {
            title: 'Lista de productos',
            result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: 'error', error: 'Error al obtener los productos de la base de datos' });
    }
}

export const getCart = async (req, res) => {
    try{
        let cartId = req.params.id;
        let cart = await cartModel.findById(cartId).populate('products.product').lean();

        if (!cart) {
            return res.status(404).json({ result: 'error', error: 'Carrito no encontrado' });
        }

        cart.products = cart.products.map(item => ({
            ...item,
            totalPrice: item.product.price * item.quantity
        }));

        res.render('templates/carts', {
            title: 'Detalles del carrito',
            cart
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: 'error', error: 'Error al obtener el carrito de la base de datos' });
    }
}

export const getProduct = async (req, res) => {
    try{
        let productId = req.params.id;
        let product = await productModel.findById(productId).lean();

        if (!product) {
            return res.status(404).json({ result: 'error', error: 'Producto no encontrado' });
        }

        res.render('templates/products', {
            title: 'Detalles del producto',
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: 'error', error: 'Error al obtener el producto de la base de datos' });
    }
}

export const getRealTimeProducts = async (req, res) => {
    let result = await productModel.find().lean();
    res.render('templates/realTimeProducts', {
        title: 'Formulario de productos',
        result
    });
}

export const getError = (req, res) => {
    res.status(500).render('templates/error', {
        title: 'Error',
        message: 'Error en el servidor'
    });
}