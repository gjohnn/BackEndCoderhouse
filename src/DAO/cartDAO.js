import { cartModel } from "./models/cart.model.js";

class CartManager {
  constructor() {
    this.model = cartModel;
  }

  async getAllCarts() {
    let carts;
    try {
      carts = await cartModel.find().lean();
    } catch (error) {
      console.log(error);
    }

    return carts;
  }

  async getCartById(id) {
    let cart;
    try {
      cart = await cartModel.findOne({ _id: id });
    } catch (error) {
      console.log(error);
    }
    return cart;
  }

  async updateCartUser(cartId, userName) {
    let cart;
    try {
      cart = await cartModel.updateOne({ _id: cartId }, userName);
    } catch (error) {
      console.log(error);
    }
    return cart;
  }
}

export default CartManager;
