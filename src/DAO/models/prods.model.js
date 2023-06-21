import mongoose from "mongoose";

const prodCol = "prods";

const prodSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  code: {
    type: Number,
    required: true,
    unique: true,
  },

  file: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

export const prodModel = mongoose.model(prodCol, prodSchema);
