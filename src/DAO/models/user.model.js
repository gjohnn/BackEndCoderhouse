import mongoose from "mongoose";
import { Schema, model } from "mongoose"

const userCol = "usuarios";

const cartSchema = new Schema(
  {
  cid: { type: Schema.Types.ObjectId, ref: 'cart', required: true, index: true },
  quantity: { type: Number, required: true },
},
  { _id: false }
)
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  carts: {
    type: [cartSchema],
    default: [],
  },
});



userSchema.pre('findOne', function () {
  this.populate('carts.cid'); 
});

userSchema.pre('find', function () {
  this.populate('carts.cid');
});

export const userModel = mongoose.model(userCol, userSchema);
