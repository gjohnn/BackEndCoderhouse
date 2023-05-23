import express from "express";
import  handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { cartsRouter } from "./routes/cart.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { realTimeProdsRouter } from "./routes/realTimeProds.routes.js";

const app = express();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname+"/views");
app.set("view engine",  "handlebars");

app.get("/", (req, res) => {
  let users = { name: "Juan" };
  res.render("realTimeProducts", users);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/realtimeproducts", realTimeProdsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("*", (req, res) => {
  return res
    .status(404)
    .json({ status: "error", msg: "No se encuentra esa ruta", data: {} });
});

const PORT = 8080;
const server = app.listen(PORT, () =>
  console.log("Server running on port: 8080")
);
