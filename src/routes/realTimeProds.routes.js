import express  from "express";

export const realTimeProdsRouter = express.Router();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname+"/views");
app.set("view engine",  "handlebars");

app.get("/", (req, res) => {
  let users = { name: "Juan" };
  res.render("realTimeProducts", users);
});