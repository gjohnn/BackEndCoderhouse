import mongoose from "mongoose";

const cartCol = "carts";

const cartSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique:true,
        required:true
    },
    products:[]
})

export const cartModel = mongoose.model(cartCol,cartSchema);