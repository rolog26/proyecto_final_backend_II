import mongoose from "mongoose";

const isValidProductId = (req, res, next) => {
        const productId = req.params.pid;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ result: 'error', error: 'ID de producto no válido' });
        }
        next();
};

export default isValidProductId;
