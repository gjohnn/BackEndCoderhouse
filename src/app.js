//BASE SETTINGS
import express from "express";
import session from 'express-session'
import FileStore from "session-file-store";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
//Passport

import passport from "passport";
import local from 'passport-local';
import initializePassport from "./config/passport.config.js";


import __dirname from "./utils.js";
import { Server } from "socket.io";

//ROUTES

import PracticeNewRouter from "./routes/practice.routes.js";

import RealTimeProdsRouter from "./routes/realTimeProds.routes.js";
import CartsRouter from "./routes/cart.routes.js";
import HomeRouter from "./routes/home.routes.js";
import SessionRouter from "./routes/session.routes.js";
import ProductsRouter from "./routes/products.routes.js"


//ONLY VIEWS
import handlebars from "express-handlebars";
import ViewsRouter from "./routes/views.routes.js";

//DB
import mongoose from "mongoose";
import { userModel } from "./DAO/models/user.model.js";
import { prodModel } from "./DAO/models/prods.model.js";
import { cartModel } from "./DAO/models/cart.model.js";

//jwt
import { generateToken, authToken } from "./utils/jwt.js";
import UserRouter from "./routes/user.routes.js";



const enviroment = async () => {
  await mongoose.connect("mongodb+srv://gjohn:JOHNhpxd@coderback.huvf7ed.mongodb.net/test?retryWrites=true&w=majority");
}
enviroment();

const fileStorage = FileStore(session)
const app = express();
const PORT = 8080;


const httpserver = app.listen(PORT, () =>
  console.log(`Server running on port: ${PORT}`)
);

const socketServer = new Server(httpserver)

socketServer.on('connection', (socket) => {
  socket.on('msg_front_back', (msg) => {
    console.log(msg);
    socketServer.emit('msg_back_front', msg)
  })
})



app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//sessions and cookies

app.use(cookieParser())

app.use(session({
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://gjohn:JOHNhpxd@coderback.huvf7ed.mongodb.net/session?retryWrites=true&w=majority',
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    ttl: 5000
  }),
  secret: "privateKey",
  resave: false,
  saveUninitialized: false
}))

initializePassport();
app.use(passport.initialize())
app.use(passport.session())

/*
app.get('/prueba', async (req,res)=>{
  req.session.user= 'messi'
  return res.send("ok")

})
app.get('/prueba/a', async (req,res)=>{
  return res.send(req.session.user)
})
*/


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//Routes

const homeRouter = new HomeRouter();
app.use("/home", homeRouter.getRouter())

const realTimeProds = new RealTimeProdsRouter();
app.use("/realtimeproducts", realTimeProds.getRouter());

const practiceNewRouter = new PracticeNewRouter()
app.use("/practice", practiceNewRouter.getRouter())

const sessionRouter = new SessionRouter() 
app.use('/api/session', sessionRouter.getRouter())

const userRouter = new UserRouter();
app.use("/api/users", userRouter.getRouter())

const viewsRouter = new ViewsRouter();
app.use("/", viewsRouter.getRouter());

const productsRouter = new ProductsRouter();
app.use("/api/products", productsRouter.getRouter());

const cartsRouter = new CartsRouter()
app.use("/api/carts", cartsRouter.getRouter());

app.get('/current', passport.authenticate('jwt'), (req,res)=>{
  return res.send('Llegamos con passport')
})

app.get("*", (req, res) => {
  let msg = "Page not found!"
  return res.status(404).render('errorPage', { msg });
});

