import express from "express"
import ProductManager from "../functions/productManager.js"
import { upload } from "../functions/productManager.js"

export const homeRouter = express.Router();

const prodManager = new ProductManager('./src/data/data.json');

homeRouter.get('/', (req,res)=>{
    try{
        let allProds = prodManager.getProds();
        const title = "Lista de productos"
        return res
        .status(200)
        .render('home', {title, allProds})

    }catch (error){
        return res
        .status(500)
        .json({status:"error", msg:"Error al obtener los productos"})
    }
})