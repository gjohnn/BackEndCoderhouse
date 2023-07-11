import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const prodCol = "prods";

const prodSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index:true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    index:true

  },

  code: {
    type: Number,
    required: true,
    unique: true,
    index:true

  },

  file: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    index:true

  },
  category: {
    type: String,
    required: true,

  },
  status: {
    type: String,
    required: true,
    index:true

  }
});

prodSchema.plugin(mongoosePaginate)


export const prodModel = mongoose.model(prodCol, prodSchema);
