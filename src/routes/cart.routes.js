import express from "express";
import ProductManager from "../functions/productManager.js";

export const cartsRouter = express.Router();

const cartManager = new ProductManager("./src/data/cart.json");
const prodManager = new ProductManager("./src/data/data.json");

cartsRouter.get("/", (req, res) => {
  try {
    const carts = cartManager.getProds();
    return res.status(200).json({
      status: "success",
      msg: "Todos los carritos",
      data: carts,
    });
  } catch {
    return res
      .status(500)
      .json({ status: "error", msg: "Error al obtener el carrito" });
  }
});
//Show prods for the selected cart
cartsRouter.get("/:cid", (req, res) => {
  const cid = req.params.cid;
  const cartFinder = cartManager.getProductById(cid);
  if (cartFinder) {
    return res
      .status(201)
      .json({ status: "success", msg: "carrito encontrado", data: cartFinder });
  } else {
    return res
      .status(400)
      .json({ status: "error", msg: "No se encontró el carrito indicado" });
  }
});

//New cart
cartsRouter.post("/", async (req, res) => {
  try {
    const newProdToCart = req.body;
    const toCart = await cartManager.addCart(newProdToCart);
    if (toCart) {
      return res
        .status(201)
        .json({ status: "Success", msg: "Carrito agregado" });
    } else {
      return res
        .status(400)
        .json({ status: "Error", msg: "no se agrego el producto al carrito" });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      msg: "no se pudo agregar el producto al carrito",
      error: error.message,
    });
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cartById = await prodManager.getProductById(cid);
    const productById = await prodManager.getProductById(pid);
    if (cartById) {
      if (productById) {
        const addProductToCart = await cartManager.addProductToCart(
          cid,
          productById
        );
        if (addProductToCart) {
          return res.status(201).json({
            status: "success",
            msg: "Producto agregado al carrito",
            data: addProductToCart,
          });
        } else {
          return res.status(400).json({
            status: "error",
            msg: "No se agregó el producto al carrito",
          });
        }
      } else {
        return res.status(400).json({
          status: "error",
          msg: "No existe el producto",
        });
      }
    }else{
        return res.status(400).json({
            status: "error",
            msg: "No existe el carrito",
          })
    }
  } catch {
    return res.status(400).json({
        status: "error",
        msg: "No se realiazó la operación",
      })
  }
});
