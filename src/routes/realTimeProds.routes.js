import express from "express";
import mongoose from "mongoose";
import { prodService } from "../services/prods.service.js";
import { upload } from "../DAO/oldFunctions.js";

export const realTimeProdsRouter = express.Router();

realTimeProdsRouter.get("/", async (req, res) => {
  let prods;
  try {
    prods = await prodService.getAllProds()
    const title = "Product list";
    return res.status(200).render("realTimeProducts", {prods, title });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", msg: "No se pudo obtener los productos" });
  }
});


/*

const btnAsc = document.getElementById("ascBtn")
  const btnDesc = document.getElementById("descBtn")
  btnAsc.addEventListener("click",async(e)=>{
    e.preventDefault();
    let prods = await prodManager.getAllProds().sort({price:1});
    return res.status(200).render("realTimeProducts", {prods, title });
  })

  btnDesc.addEventListener("click",async()=>{
    let prods = await prodManager.getAllProds().sort({price:-1});
    return res.status(200).render("realTimeProducts", {prods, title });
  })

*/