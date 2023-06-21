import { prodModel } from "./models/prods.model.js";

class ProductManager {
    constructor(){
        this.model = prodModel;
    }

    async getAllProds(){
        let prods;
    try{
        prods = await prodModel.find();
    }catch(error){
        console.log(error);
    }
    return prods;
    }

    async getProdById(id){
        let prod;
    try{
        prod = await prodModel.findOne({_id:id});
    }catch(error){
        console.log(error);
    }
        return prod;
    }

    async addProd(title,description,price,code,file,stock,category,status){
        let newProd;
        try{
            newProd = await prodModel.create({
                title,description,price,code,file,stock,category,status
            });
        }catch(error){
            console.log(error);
        }
        return newProd;
    }

    

    async updateProd(prodid, props){
        let prod;
        try{
            prod = await prodModel.updateOne({_id:prodid}, props)
        }catch(error){
            console.log(error);
        }
        return prod;
    }
/*
    async getProdById(id){
        let user;
    try{
        user = await userModel.findOne({_id:id});
    }catch(error){
        console.log(error);
    }
        return user;
    }

    async addProd(first_name, last_name, email){
        let prod;
        try{
            prod = await userModel.create({
                first_name, last_name, email
            });
        }catch(error){
            console.log(error);
        }
        return prod;
    }

    async updateProd(prodid, props){
        let prod;
        try{
            prod = await userModel.updateOne({_id:prodid}, props)
        }catch(error){
            console.log(error);
        }
        return prod;
    }
*/
}

export default ProductManager;