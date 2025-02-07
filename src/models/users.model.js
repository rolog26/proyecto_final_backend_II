import { Schema, model } from 'mongoose';
import cartModel from './carts.model.js';

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        default: 'Usuario'
    },
    cart:{ 
        type: Schema.Types.ObjectId,
        ref: 'carts'
    }
})

userSchema.post('save', async function (doc) {
    try {
        if (!doc.cart) {
            const newCart = await cartModel.create({ products: [] });
            await model('users').findByIdAndUpdate(doc._id, { cart: newCart._id });
        }
    } catch (error) {
        console.log('Error al crear el carrito del usuario', error); 
    }
})

const userModel = model('users', userSchema);

export default userModel;