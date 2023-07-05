import mongoose from "mongoose";

const userCol = "usuarios";

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
    type: [
      { 
          type: mongoose.Schema.Types.ObjectID,
          ref: "cart",
      },
    ],
    default: [],
  },
});

export const userModel = mongoose.model(userCol, userSchema);
