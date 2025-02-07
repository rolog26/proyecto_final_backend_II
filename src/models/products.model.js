import { Schema, model} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = 'products';

const stringTypeSchemaUniqueRequired = {
    type: String,
    required: true,
    unique: true
}

const stringTypeSchemaNonUniqueRequired = {
    type: String,
    required: true
}

const numberTypeSchemaRequired = {
    type: Number,
    required: true
}

const productSchema = new Schema({
    title: stringTypeSchemaUniqueRequired,
    description: stringTypeSchemaNonUniqueRequired,
    code: stringTypeSchemaUniqueRequired,
    price: numberTypeSchemaRequired,
    stock: numberTypeSchemaRequired,
    category: stringTypeSchemaUniqueRequired,
    thumbnail: {
        default: []
    }
});

productSchema.plugin(mongoosePaginate);

const productModel = model(productCollection, productSchema);

export default productModel;