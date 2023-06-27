import express from "express";
import mongoose from "mongoose";
import ProductManager from "../DAO/prodsDAO.js";
import { upload } from "../DAO/oldFunctions.js";

export const homeRouter = express.Router();

const prodManager = new ProductManager();

homeRouter.get("/", async (req, res) => {
  try {
    let prods = await prodManager.getAllProds();
    const namePage = "Products list";
    return res.status(200).render("home", {namePage, prods});
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", msg: "Error al obtener los productos" });
  }
});
