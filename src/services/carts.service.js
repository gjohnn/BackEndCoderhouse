import { cartModel } from "../DAO/models/cart.model.js";
import { prodModel } from "../DAO/models/prods.model.js";

class CartManager {
  constructor() {
    this.model = cartModel;
  }

  async getAllCarts() {
    try {
      let carts = cartModel.find();
      return carts;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(cid) {
    try {
      let findCart = cartModel.findOne({ _id: cid }, { __v: false });
      return findCart;
    } catch (error) {
      console.log(error);
    }
  }
  async createProd({ cid, pid }) {
    try {
      const findProdInCart = await cartModel.findOne({ _id: cid, products: { $elemMatch: { pid: pid } } });
      console.log(findProdInCart);
      if (findProdInCart) {
        const productToUpdate = findProdInCart.products.find(product => product.pid.equals(pid));

        if (productToUpdate) {
          await cartModel.updateOne({ _id: cid, "products.pid": pid }, { $inc: { "products.$.quantity": 1 } })
        }
      } else {
        await cartModel.findOneAndUpdate(
          { _id: cid }, { $push: { products: { pid: pid, quantity: 1 } } }
        );
      }
      const cartToUpdate = await cartModel.findOne({ _id: cid });
      return cartToUpdate;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  }

  async createCart() {
    const newCart = await cartModel.create({ products: [] });
    return newCart
  }

  async deleteProd({ cid, pid }) {
    try {
      const findProdInCart = await cartModel.findOne({ _id: cid, products: { $elemMatch: { pid: pid } } });

      if (findProdInCart) {
        const productToUpdate = findProdInCart.products.find(product => product.pid.equals(new ObjectId(pid)));

        if (productToUpdate.quantity > 1) {
          await cartModel.updateOne({ _id: cid, "products.pid": pid }, { $inc: { "products.$.quantity": -1 } })
        } else {
          await cartModel.findOneAndUpdate({ _id: cid }, { $pull: { products: { pid: pid } } });
        }
      }
      const updatedCart = await cartModel.findOne({ _id: cid });
      return updatedCart;
    } catch (error) {
      console.error('Error deleting product from cart:', error);
      throw error;
    }
  }

  async deleteCart({ cid }) {
    try {
        const cart = await cartModel.findOne({ _id: cid });

        cart.products.forEach(async (product) => {

            const pid = product.pid._id;
            const quantity = product.quantity;

            await prodModel.updateOne({ _id: pid }, { $inc: { stock: quantity } });
        });
        const updatedCart = await cartModel.findOneAndUpdate(
            { _id: cid },
            { products: [] },
            { new: true }
        );
        return updatedCart;
    } catch (error) {
        console.error('Error deleting product from cart:', error);
        throw error;
    }
}

}
export const cartService = new CartManager();
