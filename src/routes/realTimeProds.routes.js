import express  from "express";
import ProductManager from "../functions/productManager.js";
import { upload } from "../functions/productManager.js";

export const realTimeProdsRouter = express.Router();



realTimeProdsRouter.get("/", (req, res) => {
  try{
    const title = "Lista de productos";
    return res
    .status(200)
    .render('realTimeProducts', {title})

  }catch(error){
    return res
    .status(500)
    .json({status:"error", msg: "No se pudo obtener los productos"})
  }
});