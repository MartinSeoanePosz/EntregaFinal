import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now, required: true },
    products: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            default: null
            },
        quantity: { type: Number, default: 0 }
    }]
});

export const cartModel = mongoose.model(cartCollection, cartSchema);