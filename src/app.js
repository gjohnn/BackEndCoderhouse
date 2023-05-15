import express  from "express";
import { cartsRouter } from "./routes/cart.routes.js";
import { productsRouter } from "./routes/products.routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended:true }))
app.use(express.static("public"))

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('*', (req,res)=>{
    return res.status(404).json({status:"error", msg:"No se encuentra esa ruta", data:{}})
})



const PORT = 8080;
const server = app.listen(PORT, () =>
  console.log("Server running on port: 8080")
);
