import express from 'express';
import { Router } from 'express';
import { userService } from '../services/users.service.js';
import { cartService } from '../services/carts.service.js';
import { prodService } from '../services/prods.service.js';

export const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
    try{
        let validateUser = req.session.user
        return res.status(404).render("home",{validateUser})
    }catch(error){
        let msg = "Something went wrong!"
        return res.status(404).render("errorPage",{msg})
    }
})

viewsRouter.get('/users', async (req, res) => {
    try{

        let users = await userService.getAllUsers(req)
        let {payload} = users
        
        payload = payload.map((item) => {
            return{
                _id: item._id.toString(),
                first_name: item.first_name,
                last_name: item.last_name,
                email: item.email,
                carts: item.carts
            };
        });
        return res.status(200).render("newUsers", {payload})
    }
    catch (error) {
        console.log(error);
        let msg = "Can not access to users!";
        return res.status(500).render("errorPage",{msg})
    }

})




viewsRouter.get('/products', async (req, res) => {
    try{
        const { limit, sort, page, category, stock } = req.query;

        let parsedLimit = parseInt(limit);
        let parsedPage = parseInt(page);

        if (isNaN(parsedLimit) || parsedLimit <= 0) {
            parsedLimit = 10;
        }


        const viewProd = await prodService.getAllProds(req, parsedLimit, sort, parsedPage, category, stock)
        console.log(viewProd);
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
        res.status(200).render("newProds", {payload})
    }
    catch (error) {
        console.log(error)
        let msg = "Can not access to products!";
        return res.status(500).render("errorPage",{msg})
    }

})

viewsRouter.get('/carts', async (req, res) => {
    try{

        let carts = await cartService.getAllCarts(req)
        let {payload} = carts
        console.log(payload);
        payload = payload.map((item) => {
            return{
                _id: item._id.toString(),
                products: item.products
            };
        });
        return res.status(200).render("newCarts", {payload})
    }
    catch (error) {
        console.log(error);
        let msg = "Can not access to carts!";
        return res.status(500).render("errorPage",{msg})
    }

})

