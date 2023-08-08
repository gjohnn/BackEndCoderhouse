import express from "express";
import mongoose from "mongoose";
import { prodService } from "../services/prods.service.js";
import { upload } from "../DAO/oldFunctions.js";
import { userService } from "../services/users.service.js";
import RouterPass from "./router.routes.js";

export default class HomeRouter extends RouterPass{
  init(){
    this.get("/", async (req, res) => {
      try {
        let prods = await prodService.getAllProds();
        console.log(req.session.user);
        let validateUser = await userService.getUserByEmail(req.session.user)
        return res.status(200).render("home", {validateUser, prods });
      } catch (error) {
        return res
          .status(500)
          .json({ status: "error", msg: "Error al obtener los productos" });
      }
    });
    
  }
}

