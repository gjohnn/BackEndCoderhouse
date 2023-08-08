
import express from "express";
import { prodService } from "../services/prods.service.js";
import { uploader } from "../utils/multer.js";
import RouterPass from "./router.routes.js";

export default class ProductsRouter extends RouterPass{
    init(){
        this.get('/', async (req, res) => {
            try{
                const { limit, sort, page, category, stock } = req.query;
        
                let parsedLimit = parseInt(limit);
                let parsedPage = parseInt(page);
        
                if (isNaN(parsedLimit) || parsedLimit <= 0) {
                    parsedLimit = 10;
                }
        
        
                const viewProd = await prodService.getAllProds(req, parsedLimit, sort, parsedPage, category, stock)
                let {payload} = viewProd
        
                payload =  payload.map((item) => {
                    return{
                        _id: item._id.toString(),
                        title:item.title,
                        description:item.description,
                        price:item.price,
                        thumbnail:item.thumbnail,
                        code:item.code,
                        stock:item.stock,
                        category:item.category,
                        status:item.status,
                    };
                });
                res.status(200).render("products", {payload})
            }
            catch (error) {
                console.log(error)
                return res.status(500).json({ status: "error", msg: "Error getting the products" })
            }
        
        })
        
        
        
        this.get('/:pid', async (req, res) => {
            try {
                const pid = req.params.pid
                const prods = await prodService.findOne(pid)
                if (prods) {
                    return res.status(201).render("products",{ prods })
                }
                else {
                    return res.status(400).json({ status: "error", msg: 'product not found' })
                }
            }
            catch (error) {
                return res.status(500).json({ status: 'error', msg: 'the product could not be found', error: error.message });
            }
        })
        
        this.delete('/:pid', async (req, res) => {
            try {
                const pid = req.params.pid
                const deletedProduct = await prodService.delete(pid)
                return res
                    .status(200).
                    json({ status: "success", msg: 'removed product', payload: deletedProduct })
            }
            catch (error) {
                return res.status(500).json({ status: 'error', msg: 'could not delete product', error: error.message });
            }
        })
        
        this.post('/', uploader.single('file'), async (req, res) => {
            try {
                if (!req.file) {
                    return res
                        .status(400).
                        json({ status: "error", msg: 'before upload a file to be able to modify the product' })
                }
        
                const name = req.file.filename;
                const product = { ...req.body, thumbnail: `http://localhost:8080/${name}`, path: `${req.file.path}` };
                const createdProduct = await prodService.create(product)
                if (createdProduct) {
                    return res
                        .status(201).
                        json({ status: "success", msg: 'product created', payload: createdProduct })
                }
                else {
                    return res
                        .status(400).
                        json({ status: "error", msg: 'The product was not created because it does not meet the conditions' })
                }
        
            }
            catch (error) {
                return res.status(500).json({ status: 'error', msg: 'could not create product', error: error.message });
            }
        })
        
        this.put('/:pid', async (req, res) => {
            try {
                const pid = req.params.pid
                const { price, stock, status, ...rest } = req.body
                const updatedProduct = await prodService.update({ pid, price, stock, status, rest })
                if (!updatedProduct) {
                    return res
                        .status(404)
                        .json({ status: "error", msg: 'Product to update not found', payload: {} })
                }
        
                return res
                    .status(200).
                    json({ status: "success", msg: 'modified product', payload: updatedProduct })
            }
            catch (error) {
                return res.status(500).json({ status: 'error', msg: 'could not update the product', error: error.message });
            }
        })
    }
}

