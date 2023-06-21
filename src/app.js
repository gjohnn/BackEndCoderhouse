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

import mongoose from "mongoose";


const app = express();
mongoose.connect("mongodb+srv://gjohn:JOHNhpxd@coderback.huvf7ed.mongodb.net/?retryWrites=true&w=majority")


const PORT = 8080;

const httpserver = app.listen(8080, () =>
  console.log("Server running on port: 8080")
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

app.get("/", (req, res) => {
  res.send("Hola!");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//Routes
app.use("/users", userRouter)

app.use("/home", homeRouter)

app.use("/realtimeproducts", realTimeProdsRouter);

app.use("/api/products", productsRouter);

app.use("/api/carts", cartsRouter);

app.get("*", (req, res) => {
  return res
    .status(404)
    .json({ status: "error", msg: "No se encuentra esa ruta", data: {} });
});

