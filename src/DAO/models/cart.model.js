import mongoose from "mongoose";

const cartCol = "carts";

const cartSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectID
  },
  products: {
    type: [
      {
        prod: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products"
        },
      },
    ],
  },
});

export const cartModel = mongoose.model(cartCol, cartSchema);
