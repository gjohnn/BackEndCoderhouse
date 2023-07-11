import express from "express";
import { cartService } from "../services/carts.service.js";
import { prodService } from "../services/prods.service.js";

export const cartsRouter = express.Router();

cartsRouter.get("/", async (req, res) => {
  try {
    let allCarts = await cartService.getAllCarts(req)
    
    return res.status(200).json({status: "success",msg: 'carts',payload: allCarts})
  }
  catch (error) {
    console.log(error)
    return res.status(500).json({ status: "error", msg: "Error getting cart" })
  }

});
//Show prods for the selected cart
cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const carts = await cartService.findOne(cid);
    

    if (carts) {
      return res.status(200).render("carts", { carts });
    } else {
      return res.status(400).json({ status: "error", msg: 'The indicated cart was not found' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", msg: 'Internal Server Error' });
  }
});

cartsRouter.delete('/:cid', async (req, res) => {
  try {
      const cid = req.params.cid;
      const cartToEmpty = await cartService.deleteCart({cid});
      if (cartToEmpty) {
          return res
          .status(200)
          .json({ status: "success", msg: 'cart removed', payload: cartToEmpty });
      } else {
          return res
          .status(400)
          .json({ status: "error", msg: 'The indicated cart was not found' });
      }
  } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "error", msg: 'Internal Server Error' });
  }
});


cartsRouter.post('/:cid/product/:pid', async (req,res)=>{
  try{
      const cid = req.params.cid
      const pid = req.params.pid
      const productById= await prodService.findOne(pid)

      if (productById.stock > 0) {
          const createdProduct = await cartService.createProd({cid,pid})

          if (createdProduct) {
              return res
              .status(201).
              json({status:"success", msg:'product added to cart',payload:createdProduct})
          }
          else{
              return res
              .status(400).
              json({status:"error", msg:'The product was not added to the cart'})
          }
      }
      else{
          return res
              .status(400).
              json({status:"error", msg:'No product found to add to cart'})
      }
      
  }
  catch (error) {
      return res.status(500).json({ status: 'error', msg: 'could not add product to cart', error: error.message });
  }
})

cartsRouter.delete('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const cartToEmpty = await cartService.deleteCart({ cid });
    if (cartToEmpty) {
      return res
        .status(200)
        .json({ status: "success", msg: 'cart removed', payload: cartToEmpty });
    } else {
      return res
        .status(400)
        .json({ status: "error", msg: 'The indicated cart was not found' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", msg: 'Internal Server Error' });
  }
});

