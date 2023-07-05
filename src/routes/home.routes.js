import express from "express";
import mongoose from "mongoose";
import { prodService } from "../services/prods.service.js";
import { upload } from "../DAO/oldFunctions.js";

export const homeRouter = express.Router();

homeRouter.get("/", async (req, res) => {
  try {
    let prods = await prodService.getAllProds();
    const namePage = "Products list";
    return res.status(200).render("home", {namePage, prods});
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", msg: "Error al obtener los productos" });
  }
});
