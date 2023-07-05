import { prodModel } from "../DAO/models/prods.model.js";

class ProductManager {
  constructor() {
    this.model = prodModel;
  }

  async getAllProds(limit, page, query, sort) {
    try {
      let prods = prodModel.find();
      
      if (sort=="asc"){
        prods =  prods.sort({"price":1});
      }else if(sort=="desc"){
        prods =  prods.sort({"price":-1});
      }
      
      if(limit){
        prods =  prods.limit(parseInt(limit, 10));
      }else{
        limit = 10;
        prods =  prods.limit(parseInt(limit, 10));
      }

      if(query){
        prods =  prods.find({"title":query});
      }
      prods = await prods.lean();
      return prods;
    } catch (error) {
      console.log(error);
    }
    return prods;
  }

  async findOne(id) {
    let prod;
    try {
      prod = await prodModel.findOne({ _id: id });
      return prod
    } catch (error) {
      console.log(error);
    }

  }

  async addProd(
    title,
    description,
    price,
    code,
    file,
    stock,
    category,
    status
  ) {
    let newProd;
    try {
      newProd = await prodModel.create({
        title,
        description,
        price,
        code,
        file,
        stock,
        category,
        status,
      });
    } catch (error) {
      console.log(error);
    }
    return newProd;
  }

  async updateProd(prodId, props) {
    let prod;
    try {
      prod = await prodModel.updateOne({ _id: prodId }, props);
    } catch (error) {
      console.log(error);
    }
    return prod;
  }
}

export const prodService = new ProductManager();
