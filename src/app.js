//BASE SETTINGS
import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
//ROUTES
import { cartsRouter } from "./routes/cart.routes.js";
import { realTimeProdsRouter } from "./routes/realTimeProds.routes.js";
import { homeRouter } from "./routes/home.routes.js";

import productsRouter from "./routes/products.routes.js";
import userRouter from "./routes/user.routes.js";
//DB
import { userModel } from "./DAO/models/user.model.js";
import { prodModel } from "./DAO/models/prods.model.js";
import { cartModel } from "./DAO/models/cart.model.js";

const enviroment = async()=>{
 await mongoose.connect("mongodb+srv://gjohn:JOHNhpxd@coderback.huvf7ed.mongodb.net/?retryWrites=true&w=majority");
}
enviroment();

import mongoose from "mongoose";
import { viewsRouter } from "./routes/views.router.js";


const app = express();

const PORT = 8080;

const httpserver = app.listen(PORT, () =>
  console.log(`Server running on port: 7070`)
);

const socketServer = new Server(httpserver)

socketServer.on('connection',(socket)=>{
  socket.on('msg_front_back',(msg)=>{
      console.log(msg);
      socketServer.emit('msg_back_front', msg)
  })
})



app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//Routes

app.use("/home", homeRouter)
app.use("/realtimeproducts", realTimeProdsRouter);


//NOW USING
app.use("/api/users", userRouter)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/",viewsRouter)

app.get("*", (req, res) => {
  return res.status(404).send("Página no encontrada! | Page not found!");
});

