import productModel from "../models/products.model.js";

export const getProducts = async (req, res) => {
    try {
        const { limit, page, filter, ord, metFilter, metOrder } = req.query;
        const pag = page !== undefined ? page : 1;
        const lim = limit !== undefined ? limit : 10;
        const filQuery = metFilter !== undefined ? {[ metFilter ]: filter } : {};
        const ordQuery = metOrder !== undefined ? { metOrder: ord } : {};

        const products = await productModel.paginate(filQuery, { page: pag, limit: lim, ordQuery, lean: true });

        res.status(200).render('templates/home', { products });
    } catch (error) {
        res.status(500).render('templates/error', { error });
    }
}

export const getProduct = async (req, res) => {
    try {
        const idProd = req.params.pid;
        const prod = await productModel.findById(idProd);
        if (prod){
            res.status(200).render('templates/product', prod);
        }
        else {
            res.status(404).render('templates/error', { e: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).render('templates/error', { error });
    }
}

export const createProduct = async (req, res) => {
    try {
        const product = req.body;
        const respuesta = await productModel.create(product);
        res.status(201).status('Producto creado: ', { respuesta });
    } catch (error) {
        res.status(500).send(error);
    }
}

export const updateProduct = async (req, res) => {
    try {
        const idProd = req.params.pid;
        const updatedProduct = req.body;
        const respuesta = await productModel.findByIdAndUpdate(idProd, updatedProduct);
        if (respuesta) {
            res.status(201).redirect('templates/home', { respuesta });
        } else {
            res.status(404).render('templates/error', { e: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).render('templates/error', { error });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const idProd = req.params.pid;
        const respuesta = await productModel.findByIdAndDelete(idProd);
        if (respuesta) {
            res.status(200).redirect('templates/home', { respuesta });
        } else {
            res.status(404).render('templates/error', { e: 'Producto no encontrado' });
        }
        res.status(200).redirect('templates/product', { respuesta });
    } catch (error) {
        res.status(500).render('templates/error', { error });
    }
}