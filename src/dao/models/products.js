import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true,
    },
    description:{
        type: String,
        require: true,
    },
    price:{
        type: Number,
        require: true,
    },
    thumbnail:{
        type: String,
        require: true,
    },
    code:{
        type: String,
        require: true,
        unique: true,
    },
    category:{
        type: String,
        require: true,
    },
    stock:{
        type: Number,
        require: true,
    },
    owner:{
        type: String,
        require: true,
        default: 'admin',
    },
});

productSchema.plugin(mongoosePaginate);
export const productModel = mongoose.model(productCollection, productSchema);
    
