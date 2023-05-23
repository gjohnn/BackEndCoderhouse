import express from "express";
import ProductManager from "../functions/productManager.js";
import { upload } from "../functions/productManager.js";

export const productsRouter = express.Router();


const prodManager = new ProductManager("./src/data/data.json");

productsRouter.get("/", async (req, res) => {
  let allProds = await prodManager.getProds();
  try {
    const limit = req.query.limit;

    if (limit <= allProds.length) {
      allProds = allProds.slice(0, limit);
      return res.status(200).json({
        status: "success",
        msg: "Cantidad de productos limitada",
        data: allProds,
      });
    } else if (limit > allProds.length) {
      return res.status(400).json({
        status: "error",
        msg: "Cantidad solicitada supera los productos disponibles",
      });
    } else {
      return res.status(200).json({
        status: "success",
        msg: "Todos los productos",
        data: allProds,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

productsRouter.post('/',  upload.single('file'), async (req,res)=>{
  try{
    if(!req.file){
      return res
      .status(400)
      .json({status: "error", msg:"Suba un archivo"})
    }

    
      const producto = req.body
      const newProd = await prodManager.addProduct(producto)
      producto.file = req.file.filename;
      if (newProd) {
          return res
          .status(201).
          json({status:"success", msg:'producto creado'})
      }
      else{
          return res
          .status(400).
          json({status:"error", msg:'No se creo el producto porque no cumple las condiciones'})
      }
      
  }
  catch (error) {
      return res.status(500).json({ status: 'error', msg: 'No se pudo crear el producto', error: error.message });
  }
})


productsRouter.get('/:pid',(req,res)=>{
  try{
      const pid=req.params.pid
      const prodFinder = prodManager.getProductById(pid)
      if (prodFinder) {
          return res
          .status(201).
          json({status:"success", msg:'Producto encontrado',data:prodFinder})
      }
      else{
          return res
          .status(400).
          json({status:"error", msg:'No se encontro el producto'})
      }
  }
  catch (error) {
      return res.status(500).json({ status: 'error', msg: 'No se pudo encontrar el producto', error: error.message });
  }
})

productsRouter.delete('/:id', async(req,res)=>{
  const id=req.params.id
  const deletedProduct = await prodManager.deleteProd(id)
  return res
  .status(200).
  json({status:"success", msg:'Producto eliminado',data:deletedProduct})
})

productsRouter.put('/:id',async (req,res)=>{
  const id=req.params.id
  const newBody=req.body
  const updatedProduct = await prodManager.updateProd(id, newBody)
  if (!updatedProduct) {
      console.log('Producto a actualizar no encontrado')
      return res
      .status(404)
      .json({status:"error", msg:'Producto para actualizar no encontrado',data:{}})
  }
  return res
  .status(200).
  json({status:"success", msg:'Producto modificado',data:updatedProduct})
})
