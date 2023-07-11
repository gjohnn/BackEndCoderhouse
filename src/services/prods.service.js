import { prodModel } from "../DAO/models/prods.model.js";
import { parse } from "url"

class ProductManager {
  constructor() {
    this.model = prodModel;
  }

  async getAllProds(req, limit, sort, numberPage, category, stock) {

    try {
      let query = prodModel.find({}, { path: false, __v: false, });

      if (sort) {
        query = query.sort({ "price": sort })
      }

      if (category) {
        query = query.find({ "category": category });
      } else if (stock) {
        query = query.find({ "stock": stock });
      }


      const pages = await prodModel.paginate(query, { "limit": limit, page: numberPage || 1 });


      const { docs, totalPages, page, hasPrevPage, hasNextPage, prevPage, nextPage } = pages;

      const currentLink = `${req.protocol}://${req.get('host')}${req.originalUrl}`

      const response = {
        status: "success",
        payload: docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? getPrevLink(currentLink, prevPage) : null,
        nextLink: hasNextPage ? getNextLink(currentLink, nextPage) : null,
      };





      return response;

      function getPrevLink(currentLink, prevPage) {
        const parsedUrl = parse(currentLink, true);
        const searchParams = new URLSearchParams(parsedUrl.search);
        searchParams.set('page', prevPage);
        const updatedLink = `${parsedUrl.pathname}?${searchParams.toString()}`;
        return `${req.protocol}://${req.get('host')}${updatedLink}`
      }

      function getNextLink(currentLink, nextPage) {
        const parsedUrl = parse(currentLink, true);
        const searchParams = new URLSearchParams(parsedUrl.search);
        searchParams.set('page', nextPage);
        const updatedLink = `${parsedUrl.pathname}?${searchParams.toString()}`;
        return `${req.protocol}://${req.get('host')}${updatedLink}`
      }
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id) {
    let prod;
    try {
      prod = await prodModel.findOne({ _id: id });
      return prod;
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
