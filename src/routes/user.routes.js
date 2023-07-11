import { Router } from "express";
import { userModel } from "../DAO/models/user.model.js";
import { userService } from "../services/users.service.js";
import { cartService } from "../services/carts.service.js";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  let users;
  try {
    users = await userService.getAllUsers();
    const titlePage = "Users list";
    console.log(users);
    res.status(200).render("users", { titlePage, users });
  } catch {
    res.status(404).send({ status: "error", error: "wtf" });
  }

});

userRouter.post("/", async (req, res) => {
  let response;
  let { first_name, last_name, email } = req.body;
  if (!first_name || !last_name || !email) {
    return res.send({ status: "error", error: "Incomplete values" });
  }
  try {
    response = await userService.addUser(first_name, last_name, email);
  } catch (error) {
    res.status(500).send({ status: "error", error: "Something is missing" });
  }
  res.send({ status: "success", payload: response });
});

userRouter.get("/:userid", async (req, res) => {
  let userId = req.params.userid;
  let user;
  try {
    user = await userService.getUserById(userId);
    if (user) {
      res.send({ status: "success", payload: { user } });
    } else {
      res.send({ status: "success", payload: "No existe" });
    }
  } catch {
    res.status(404).send({ status: "error", error });
  }
});


userRouter.post("/:uid/cart/:cid", async (req, res) => {

  try {
    let uid = req.params.uid;
    console.log(uid);
    let cid = req.params.cid;
    console.log(cid);
    let cart = await cartService.findOne(cid);
    if (cart) {
      const cartToUser = await userService.addCartToUser({uid,cid})
      if (cartToUser) {
        return res.send({ status: "success", payload: { cartToUser } });
      }
    } else {
      return res.send({ status: "success", payload: "Cant add cart to user" });
    }
  } catch (error) {
    return res.status(404).send({ status: "error", payload: "nop!" });
  }
});



userRouter.put("/:userId", async (req, res) => {
  let userId = req.params.userId;

  let { first_name, last_name, email } = req.body;

  if (!first_name || !last_name || !email)
    return res.send({ status: "error", error: "Incomplete values" });

  let updatedUser;

  try {
    updatedUser = await userService.updateUser(userId, {
      first_name,
      last_name,
      email,
    });
  } catch {
    res.status(404).send({ status: "error", error });
  }

  res.send({ status: "Update has successed", payload: updatedUser });
});

export default userRouter;
