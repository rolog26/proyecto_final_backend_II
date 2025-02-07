import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: {
        type: [
            {
                id_product: { 
                    type: Schema.Types.ObjectId, 
                    required: true, 
                    ref: 'products'
                },
                quantity: { 
                    type: Number, 
                    required: true 
                }
            }
        ],
        default: []
    }
});

cartSchema.pre('findOne', function () {
    this.populate('products.id_product');
})

const cartModel = model('carts', cartSchema);

export default cartModel;