import fs from "fs";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req,file, cb){
    cb(null, './public/img');
  },
  filename: function(req, file, cb){
    cb(null,`${Date.now()} - ${file.originalname}`)
  }
})

export const upload = multer ({storage: storage})

class ProductManager {
  constructor(path) {
    this.path = path;
    this.readData();
  }

  async readData() {
    try {
      let content = await fs.promises.readFile(this.path, "utf-8");
      this.products = JSON.parse(content);
    } catch (error) {
      console.log(error);
    }
  }
  async saveData() {
    try {
      const data = JSON.stringify(this.products);
      await fs.promises.writeFile(this.path, data);
    } catch (error) {
      console.error(error);
    }
  }
  getProds() {
    return this.products;
  }

  getIdMax(){
    let idMax = 0
    this.products.forEach(prod => {
        if(prod.id > idMax){
            idMax=prod.id
        }
    });
    idMax++
    return idMax
}


  getProductById(id) {
    const productById = this.products.find(
      (prod) => parseInt(prod.id) === parseInt(id)
    );
    if (!productById) {
      console.log("Producto buscado por ID no encontrado");
      return false;
    }
    return productById;
  }
  async addProduct(product) {
    console.log(product);
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.file ||
      !product.code ||
      !product.stock ||
      !product.category ||
      !product.status
    ) {
      console.log("Faltan campos obligatorios");
      return false;
    }

    if (this.products.some((prod) => prod.code === product.code)) {
      console.log("El código del producto ya existe");
      return false;
    }

    const idMax = this.getIdMax();
    const prod = { id: idMax, ...product };
    this.products.push(prod);
    await this.saveData();
    return true;
  }
  async addCart() {

    const idMax = this.getIdMax()
    const prod = { id: idMax, products:[] }
    this.products.push(prod)
    await this.saveData()
    return true;
}

async addProductToCart(cid, product) {
  const productIndex = this.products.findIndex((prod) => parseInt(prod.id) === parseInt(cid))
  console.log(productIndex);
  const newProduct = { id:product.id }

  if (productIndex !== -1) {
      const cartObtained = this.products[productIndex];
      console.log(cartObtained);
      const prodIndex = cartObtained.products.findIndex((el) => parseInt(el.id) === parseInt(product.id))
      console.log(prodIndex);
      if (prodIndex !== -1) {
        cartObtained.products[prodIndex].quantity++
      }
      else{
          newProduct.quantity = 1
          cartObtained.products.push(newProduct)
      }
  } else {
      console.log('Carrito para agregar producto no encontrado')
      return false
  }
  
  await this.saveData()
  return true;

}

async deleteProd(id) {
  const productIndex = this.products.findIndex((prod) => parseInt(prod.id) === parseInt(id))
  if (productIndex === -1) {
      console.log('Producto para eliminar no encontrado')
      return false;
  }
  this.products.splice(productIndex, 1)
  await this.saveData()
  return true;
}

async updateProd(id, updatedFields) {
  const productIndex = this.products.findIndex((prod) => parseInt(prod.id) === parseInt(id))
  if (productIndex === -1) {
      console.log('Producto para actualizar no encontrado')
      return false
  }
  const product = { ...this.products[productIndex], ...updatedFields }
  this.products[productIndex] = product
  await this.saveData()
  return true;
}



}

export default ProductManager;
