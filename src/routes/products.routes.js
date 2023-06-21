
import { Router } from "express";
import ProductManager from "../DAO/prodsDAO.js";
import { upload } from "../functions/productManager.js";

const productsRouter = Router();

const prodManager = new ProductManager();

//const prodManager = new ProductManager("./src/data/data.json");


productsRouter.get("/", async (req, res) => {

  let prods;
    try{
        prods= await prodManager.getAllProds();
    }catch{
        res.status(404).send({status:"error"})
    }
    res.send({status:"success", payload:prods})
});

productsRouter.post("/", async(req,res)=>{
  let response;
  let {title,description,price,code,file,stock,category,status} = req.body;
  if (!title || !price /*|| !code || !stock || !category || !status*/){
     return res.send({status:"error", error:"Incomplete values"})
  }
  try{
      response = await  prodManager.addProd(title,description,price,code,file,stock,category,status);
  }catch(error){
     res.status(500).send({status:"error", error:"Something is missing"})
  }
  res.send({status:"success", payload:response})
})

productsRouter.get("/:prodid", async(req,res)=>{
  let prodId = req.params.prodid;
  console.log(prodId);
    let prod;
    try{
      prod = await prodManager.getProdById(prodId);
        if (prod){
            res.send({status:"success", payload:{prod}})
        }else{
            res.send({status:"success", payload:"No existe"})
        }
    }catch(error){
        res.status(404).send({status:"error", error: "error"})
    }
})
productsRouter.put("/:prodid", async(req,res)=>{
  let prodId = req.params.prodid;

  let {title,description,price,code,file,stock,category,status} = req.body;

  if (!title) return res.send({status:"error", error:"Incomplete values"})

  let updatedProd;

  try{
    updatedProd = await prodManager.updateProd(prodId, {title,description,price,code,file,stock,category,status} );
  }catch(error){
      res.status(404).send({status:"error", error})
  }
  
  res.send({status:"Update has been successed", payload:updatedProd})
})
export default productsRouter;


/*
















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
*/

