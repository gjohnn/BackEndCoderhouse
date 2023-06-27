import { Router } from "express";
import { userModel } from "../DAO/models/user.model.js";
import UserManager from "../DAO/userDAO.js";

const userRouter = Router();

const userManager = new UserManager();

userRouter.get("/", async (req, res) => {
  let users;
  try {
    users = await userManager.getAllUsers();
    const titlePage = "Users list";
    console.log(users);
    res.status(200).render("users", { titlePage, users });
  } catch {
    res.status(404).send({ status: "error", error:"wtf" });
  }
  
});

userRouter.post("/", async (req, res) => {
  let response;
  let { first_name, last_name, email } = req.body;
  if (!first_name || !last_name || !email) {
    return res.send({ status: "error", error: "Incomplete values" });
  }
  try {
    response = await userManager.addUser(first_name, last_name, email);
  } catch (error) {
    res.status(500).send({ status: "error", error: "Something is missing" });
  }
  res.send({ status: "success", payload: response });
});

userRouter.get("/:userid", async (req, res) => {
  let userId = req.params.userid;
  let user;
  try {
    user = await userManager.getUserById(userId);
    if (user) {
      res.send({ status: "success", payload: { user } });
    } else {
      res.send({ status: "success", payload: "No existe" });
    }
  } catch {
    res.status(404).send({ status: "error", error });
  }
});

userRouter.put("/:userId", async (req, res) => {
  let userId = req.params.userId;

  let { first_name, last_name, email } = req.body;

  if (!first_name || !last_name || !email)
    return res.send({ status: "error", error: "Incomplete values" });

  let updatedUser;

  try {
    updatedUser = await userManager.updateUser(userId, {
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
