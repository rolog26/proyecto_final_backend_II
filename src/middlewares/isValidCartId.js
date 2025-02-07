import mongoose from "mongoose";

const isValidCartId = (req, res, next) => {
        const cartId = req.params.cid;
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            return res.status(400).json({ result: 'error', error: 'ID de carrito no válido' });
        }
        next();
}

export default isValidCartId;