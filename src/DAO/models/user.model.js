import mongoose from "mongoose";
import { Schema, model } from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2";

const cartSchema = new mongoose.Schema(
  {
  cid: { type: Schema.Types.ObjectId, ref: 'carts', required: true, index: true },
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

userSchema.plugin(mongoosePaginate)

export const userModel = mongoose.model("usuarios", userSchema);
