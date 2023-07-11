import { Schema, model } from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2"



const productSchema = new Schema(
    {
    pid: { type: Schema.Types.ObjectId, ref: 'prods', required: true, index:true },
    quantity: { type: Number, required: true },
    },
    { _id: false }
);

const cartSchema = new Schema({
    products: { type: [productSchema], required: true },
});

cartSchema.pre('findOne', function () {
    this.populate('products.pid');
});

cartSchema.pre('find', function () {
    this.populate('products.pid');
});

cartSchema.plugin(mongoosePaginate)

export const cartModel = model("carts", cartSchema);

